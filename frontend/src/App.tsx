import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, TestTube, Database, Filter } from 'lucide-react'

interface TestCase {
  id: number
  domain: string
  naturalLanguage: string
  referenceSql: string
}

interface TestResult {
  testId: number
  question: string
  isSqlCorrect: boolean
  isResultMatch: boolean
  generationTimeMs: number
}

interface TestReport {
  passed: number
  total: number
  results: TestResult[]
}

const DOMAIN_OPTIONS = [
  { value: 'video', label: 'Видео' },
  { value: 'messenger', label: 'Мессенджер' },
  { value: 'delivery', label: 'Доставка' }
]

const DOMAIN_NAMES = {
  video: 'ВИДЕО',
  messenger: 'МЕССЕНДЖЕР',
  delivery: 'ДОСТАВКА'
}

function App() {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('video')
  const [result, setResult] = useState('Результаты появятся здесь...')
  const [isLoading, setIsLoading] = useState(false)
  const [testReport, setTestReport] = useState<TestReport | null>(null)
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [domainFilter, setDomainFilter] = useState('all')
  const [isLoadingTestCases, setIsLoadingTestCases] = useState(true)

  const submitQuery = async (useStream = false) => {
    if (!query.trim()) {
      setResult('Пожалуйста, введите запрос')
      return
    }

    setIsLoading(true)
    setResult('Обработка...')

    try {
      const url = useStream ? '/generate-sql-stream' : '/generate-sql'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, domain })
      })

      if (useStream) {
        const reader = response.body?.getReader()
        if (!reader) throw new Error('Stream not available')
        
        let accumulated = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = new TextDecoder().decode(value)
          try {
            accumulated += JSON.parse(chunk).response
          } catch (e) {
            console.error('Error parsing chunk:', e)
          }
          setResult(accumulated)
        }
      } else {
        const data = await response.json()
        setResult(data.sql || data.error || 'Результат не получен')
      }
    } catch (error) {
      setResult(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const runTests = async () => {
    setIsRunningTests(true)
    setTestReport(null)

    try {
      const response = await fetch('/api/test-runner/run', { method: 'POST' })
      const report = await response.json()
      setTestReport(report)
    } catch (error) {
      console.error('Error running tests:', error)
    } finally {
      setIsRunningTests(false)
    }
  }

  const loadTestCases = async () => {
    setIsLoadingTestCases(true)
    try {
      const response = await fetch('/api/test-runner/test-cases')
      if (!response.ok) throw new Error('Не удалось загрузить тестовые случаи')
      
      const cases = await response.json()
      setTestCases(cases)
    } catch (error) {
      console.error('Error loading test cases:', error)
      setTestCases([])
    } finally {
      setIsLoadingTestCases(false)
    }
  }

  useEffect(() => {
    loadTestCases()
  }, [])

  const filteredTestCases = testCases.filter(tc => 
    domainFilter === 'all' || tc.domain === domainFilter
  )

  const groupedTestCases = filteredTestCases.reduce((acc, tc) => {
    if (!acc[tc.domain]) acc[tc.domain] = []
    acc[tc.domain].push(tc)
    return acc
  }, {} as Record<string, TestCase[]>)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">SQL LLM Интерфейс</h1>
        <p className="text-muted-foreground mt-2">Генерация SQL запросов с помощью искусственного интеллекта</p>
      </div>

      {/* Manual Query Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Введите ваш запрос
          </CardTitle>
          <CardDescription>
            Опишите что вы хотите найти на естественном языке
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Домен:</label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOMAIN_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Запрос:</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="например: покажи все видео"
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            onClick={() => submitQuery(true)} 
            disabled={isLoading}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? 'Обработка...' : 'Сгенерировать SQL'}
          </Button>
          
          <div className="p-4 bg-muted rounded-md">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Automated Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Автоматизированные тесты
          </CardTitle>
          <CardDescription>
            Запустите тесты для проверки качества генерации SQL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={isRunningTests}
            variant="outline"
            className="w-full"
          >
            <TestTube className="h-4 w-4 mr-2" />
            {isRunningTests ? 'Выполнение тестов...' : 'Запустить все тесты'}
          </Button>
          
          {testReport && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p className="font-semibold">
                  Пройдено {testReport.passed} / {testReport.total}
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">ID</th>
                      <th className="border border-border p-2 text-left">Вопрос</th>
                      <th className="border border-border p-2 text-left">SQL верный?</th>
                      <th className="border border-border p-2 text-left">Результат совпадает?</th>
                      <th className="border border-border p-2 text-left">Время (мс)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testReport.results.map((result) => (
                      <tr key={result.testId}>
                        <td className="border border-border p-2">{result.testId}</td>
                        <td className="border border-border p-2">{result.question}</td>
                        <td className={`border border-border p-2 font-bold ${result.isSqlCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {result.isSqlCorrect ? '✔' : '✘'}
                        </td>
                        <td className={`border border-border p-2 font-bold ${result.isResultMatch ? 'text-green-600' : 'text-red-600'}`}>
                          {result.isResultMatch ? '✔' : '✘'}
                        </td>
                        <td className="border border-border p-2">{result.generationTimeMs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Cases Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Тестовые случаи
          </CardTitle>
          <CardDescription>
            Просмотр всех доступных тестовых случаев
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Фильтр по домену:</label>
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все домены</SelectItem>
                {DOMAIN_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isLoadingTestCases ? (
            <div className="p-4 text-center text-muted-foreground">
              Загрузка тестовых случаев...
            </div>
          ) : Object.keys(groupedTestCases).length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Тестовые случаи для выбранного фильтра не найдены.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedTestCases).sort().map(domain => (
                <div key={domain}>
                  <h4 className="text-lg font-semibold mb-3 p-2 bg-muted rounded">
                    Домен: {DOMAIN_NAMES[domain as keyof typeof DOMAIN_NAMES] || domain.toUpperCase()}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-2 text-left">ID</th>
                          <th className="border border-border p-2 text-left">Вопрос</th>
                          <th className="border border-border p-2 text-left">SQL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedTestCases[domain].map((testCase) => (
                          <tr key={testCase.id}>
                            <td className="border border-border p-2">{testCase.id}</td>
                            <td className="border border-border p-2">{testCase.naturalLanguage}</td>
                            <td className="border border-border p-2">
                              <pre className="text-xs bg-muted p-2 rounded max-h-32 overflow-y-auto font-mono">
                                {testCase.referenceSql}
                              </pre>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
