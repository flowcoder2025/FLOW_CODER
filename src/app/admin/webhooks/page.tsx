'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Webhook,
  Plus,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Key,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

// 웹훅 이벤트 타입
const WEBHOOK_EVENTS = [
  { id: 'POST_CREATED', label: '게시글 생성', description: '새 게시글이 작성될 때' },
  { id: 'POST_UPDATED', label: '게시글 수정', description: '게시글이 수정될 때' },
  { id: 'POST_DELETED', label: '게시글 삭제', description: '게시글이 삭제될 때' },
];

// 웹훅 타입
const WEBHOOK_TYPES = [
  { id: 'GENERIC', label: '일반', description: 'JSON 페이로드 + HMAC 서명' },
  { id: 'DISCORD', label: 'Discord', description: 'Discord Embed 형식' },
  { id: 'SLACK', label: 'Slack', description: 'Slack Block Kit 형식' },
];

type WebhookType = 'GENERIC' | 'DISCORD' | 'SLACK';

interface WebhookSubscription {
  id: string;
  url: string;
  secret: string;
  events: string[];
  type: WebhookType;
  isActive: boolean;
  description: string | null;
  lastTriggeredAt: string | null;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

/**
 * 웹훅 관리 페이지
 *
 * - Inbound: 외부에서 게시글 작성 API
 * - Outbound: 이벤트 발생 시 외부로 알림
 */
export default function AdminWebhooksPage() {
  // Inbound 상태
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [origin, setOrigin] = useState('https://your-domain.com');

  // Outbound 상태
  const [subscriptions, setSubscriptions] = useState<WebhookSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  // 새 구독 생성 다이얼로그 상태
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [newType, setNewType] = useState<WebhookType>('GENERIC');
  const [creating, setCreating] = useState(false);

  // 테스트 웹훅 상태
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [testType, setTestType] = useState<WebhookType>('GENERIC');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // 카테고리 목록 조회
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data?.categories || []);
      }
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  }, []);

  // Outbound 웹훅 목록 조회
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/webhooks/outbound');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.data?.subscriptions || []);
      } else {
        toast.error('웹훅 목록 조회 실패');
      }
    } catch (error) {
      console.error('웹훅 조회 실패:', error);
      toast.error('웹훅 목록 조회 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
    fetchCategories();
    fetchSubscriptions();
  }, [fetchCategories, fetchSubscriptions]);

  // API Key 복사
  const copyApiKey = () => {
    // 환경변수 값은 클라이언트에서 직접 접근 불가
    // 실제 값은 서버에서만 알 수 있으므로 안내 메시지 표시
    toast.info('API Key는 서버의 ADMIN_API_KEY 환경변수에 설정되어 있습니다');
  };

  // Outbound 웹훅 생성
  const handleCreateSubscription = async () => {
    if (!newUrl || selectedEvents.length === 0) {
      toast.error('URL과 최소 1개 이벤트를 선택해주세요');
      return;
    }

    // URL 형식 검증
    try {
      new URL(newUrl);
    } catch {
      toast.error('유효한 URL을 입력해주세요');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/admin/webhooks/outbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newUrl,
          events: selectedEvents,
          type: newType,
          description: newDescription || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('웹훅이 생성되었습니다');
        setCreateDialogOpen(false);
        setNewUrl('');
        setNewDescription('');
        setSelectedEvents([]);
        setNewType('GENERIC');
        fetchSubscriptions();

        // 생성된 시크릿 표시
        if (data.data?.subscription?.secret) {
          toast.info(`시크릿 키: ${data.data.subscription.secret}`, {
            duration: 10000,
            description: '이 키는 다시 표시되지 않습니다. 안전하게 보관하세요.',
          });
        }
      } else {
        const error = await response.json();
        toast.error(error.error?.message || '웹훅 생성 실패');
      }
    } catch (error) {
      console.error('웹훅 생성 실패:', error);
      toast.error('웹훅 생성 중 오류가 발생했습니다');
    } finally {
      setCreating(false);
    }
  };

  // 웹훅 활성화/비활성화 토글
  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/admin/webhooks/outbound/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      });

      if (response.ok) {
        toast.success(currentState ? '웹훅이 비활성화되었습니다' : '웹훅이 활성화되었습니다');
        fetchSubscriptions();
      } else {
        const error = await response.json();
        toast.error(error.error?.message || '상태 변경 실패');
      }
    } catch (error) {
      console.error('상태 변경 실패:', error);
      toast.error('상태 변경 중 오류가 발생했습니다');
    }
  };

  // 웹훅 삭제
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/webhooks/outbound/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('웹훅이 삭제되었습니다');
        fetchSubscriptions();
      } else {
        const error = await response.json();
        toast.error(error.error?.message || '삭제 실패');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제 중 오류가 발생했습니다');
    }
  };

  // 웹훅 테스트
  const handleTest = async () => {
    if (!testUrl) {
      toast.error('테스트할 URL을 입력해주세요');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl, type: testType }),
      });

      const data = await response.json();

      if (response.ok && data.data?.success) {
        setTestResult({ success: true, message: `${testType} 웹훅 연결 테스트 성공!` });
      } else {
        setTestResult({
          success: false,
          message: data.data?.message || data.error?.message || '테스트 실패',
        });
      }
    } catch (error) {
      console.error('테스트 실패:', error);
      setTestResult({ success: false, message: '네트워크 오류가 발생했습니다' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">웹훅 관리</h2>
        <p className="text-muted-foreground">
          외부 시스템 연동을 위한 웹훅 설정
        </p>
      </div>

      <Tabs defaultValue="inbound" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbound">
            <ExternalLink className="h-4 w-4 mr-2" />
            Inbound (외부 → 시스템)
          </TabsTrigger>
          <TabsTrigger value="outbound">
            <Webhook className="h-4 w-4 mr-2" />
            Outbound (시스템 → 외부)
          </TabsTrigger>
        </TabsList>

        {/* Inbound 탭 */}
        <TabsContent value="inbound" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <Key className="h-5 w-5" />
              외부 포스팅 API
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              외부 시스템에서 이 API를 호출하여 게시글을 작성할 수 있습니다.
            </p>
          </div>

          {/* API 엔드포인트 정보 */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">엔드포인트</Label>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="font-mono">POST</Badge>
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                  /api/admin/webhooks/inbound/posts
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${origin}/api/admin/webhooks/inbound/posts`
                    );
                    toast.success('URL이 복사되었습니다');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">인증 헤더</Label>
              <div className="mt-1 flex items-center gap-2">
                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                  X-Admin-API-Key: {apiKeyVisible ? '[ADMIN_API_KEY 환경변수 값]' : '••••••••••••••••'}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setApiKeyVisible(!apiKeyVisible)}
                >
                  {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={copyApiKey}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                서버의 ADMIN_API_KEY 환경변수에 설정된 값을 사용하세요.
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">요청 본문 예시</Label>
              <pre className="mt-1 bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "title": "게시글 제목",
  "content": "게시글 내용",
  "categoryId": "${categories[0]?.id || 'category_id'}",
  "tags": ["태그1", "태그2"],
  "coverImageUrl": "https://...",
  "authorId": "user_id (선택)"
}`}
              </pre>
            </div>

            <div>
              <Label className="text-sm font-medium">사용 가능한 카테고리</Label>
              <p className="text-xs text-muted-foreground mt-1 mb-2">
                카테고리가 게시글 유형을 결정합니다 (Q&A, 뉴스, 커뮤니티 등)
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.length === 0 ? (
                  <span className="text-sm text-muted-foreground">카테고리 로딩 중...</span>
                ) : (
                  categories.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="font-mono text-xs">
                      {cat.name}: {cat.id}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">cURL 예시</Label>
              <pre className="mt-1 bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST ${origin}/api/admin/webhooks/inbound/posts \\
  -H "Content-Type: application/json" \\
  -H "X-Admin-API-Key: your-admin-api-key" \\
  -d '{
    "title": "외부에서 작성한 게시글",
    "content": "API를 통해 작성된 내용입니다.",
    "categoryId": "${categories[0]?.id || 'category_id'}",
    "tags": ["개발", "팁"],
    "coverImageUrl": "https://example.com/thumbnail.jpg"
  }'`}
              </pre>
            </div>

            <div>
              <Label className="text-sm font-medium">필드 설명</Label>
              <div className="mt-2 text-sm space-y-1">
                <p><code className="bg-gray-100 px-1 rounded">title</code> - 게시글 제목 (필수, 최대 200자)</p>
                <p><code className="bg-gray-100 px-1 rounded">content</code> - 게시글 내용 (필수, 최대 50,000자)</p>
                <p><code className="bg-gray-100 px-1 rounded">categoryId</code> - 카테고리 ID (필수)</p>
                <p><code className="bg-gray-100 px-1 rounded">tags</code> - 태그 배열 (선택, 최대 5개, 각 20자)</p>
                <p><code className="bg-gray-100 px-1 rounded">coverImageUrl</code> - 썸네일 이미지 URL (선택)</p>
                <p><code className="bg-gray-100 px-1 rounded">authorId</code> - 작성자 ID (선택, 미지정 시 시스템 계정)</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Outbound 탭 */}
        <TabsContent value="outbound" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex-1 mr-4">
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                이벤트 알림 웹훅
              </h3>
              <p className="text-sm text-green-700 mt-1">
                게시글 생성/수정/삭제 시 등록된 URL로 알림을 전송합니다.
              </p>
            </div>
            <div className="flex gap-2">
              {/* 테스트 다이얼로그 */}
              <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    연결 테스트
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>웹훅 연결 테스트</DialogTitle>
                    <DialogDescription>
                      URL에 테스트 페이로드를 전송하여 연결을 확인합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>테스트 URL</Label>
                      <Input
                        placeholder="https://your-webhook-endpoint.com/webhook"
                        value={testUrl}
                        onChange={(e) => setTestUrl(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>웹훅 타입</Label>
                      <Select value={testType} onValueChange={(v) => setTestType(v as WebhookType)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WEBHOOK_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{type.label}</span>
                                <span className="text-xs text-muted-foreground">- {type.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Discord/Slack 웹훅은 해당 서비스의 페이로드 형식으로 전송됩니다.
                      </p>
                    </div>
                    {testResult && (
                      <div
                        className={`p-3 rounded-lg flex items-center gap-2 ${
                          testResult.success
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {testResult.success ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        {testResult.message}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleTest}
                      disabled={testing || !testUrl}
                    >
                      {testing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          테스트 중...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          테스트 실행
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* 생성 다이얼로그 */}
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    웹훅 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>새 웹훅 구독 생성</DialogTitle>
                    <DialogDescription>
                      이벤트 발생 시 알림을 받을 URL을 등록합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>웹훅 URL *</Label>
                      <Input
                        placeholder="https://your-server.com/webhook"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>웹훅 타입 *</Label>
                      <Select value={newType} onValueChange={(v) => setNewType(v as WebhookType)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WEBHOOK_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{type.label}</span>
                                <span className="text-xs text-muted-foreground">- {type.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>설명</Label>
                      <Textarea
                        placeholder="이 웹훅의 용도를 설명해주세요 (선택)"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>구독할 이벤트 *</Label>
                      <div className="mt-2 space-y-2">
                        {WEBHOOK_EVENTS.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={event.id}
                              checked={selectedEvents.includes(event.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedEvents([...selectedEvents, event.id]);
                                } else {
                                  setSelectedEvents(
                                    selectedEvents.filter((e) => e !== event.id)
                                  );
                                }
                              }}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label
                                htmlFor={event.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {event.label}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleCreateSubscription}
                      disabled={creating || !newUrl || selectedEvents.length === 0}
                    >
                      {creating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        '생성'
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 웹훅 구독 목록 */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>상태</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>이벤트</TableHead>
                  <TableHead>마지막 실행</TableHead>
                  <TableHead>실패 횟수</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                      <span className="mt-2 block text-sm text-muted-foreground">
                        로딩 중...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Webhook className="h-8 w-8 mx-auto text-muted-foreground" />
                      <span className="mt-2 block text-sm text-muted-foreground">
                        등록된 웹훅이 없습니다.
                      </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={sub.isActive}
                            onCheckedChange={() =>
                              handleToggleActive(sub.id, sub.isActive)
                            }
                          />
                          {sub.isActive ? (
                            <Badge variant="default" className="bg-green-500">
                              활성
                            </Badge>
                          ) : (
                            <Badge variant="secondary">비활성</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={sub.type === 'DISCORD' ? 'default' : sub.type === 'SLACK' ? 'secondary' : 'outline'}
                          className={
                            sub.type === 'DISCORD'
                              ? 'bg-indigo-500 hover:bg-indigo-600'
                              : sub.type === 'SLACK'
                                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                : ''
                          }
                        >
                          {WEBHOOK_TYPES.find((t) => t.id === sub.type)?.label || sub.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate block">
                            {sub.url}
                          </code>
                          {sub.description && (
                            <span className="text-xs text-muted-foreground mt-1 block">
                              {sub.description}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {sub.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {sub.lastTriggeredAt ? (
                          <span className="text-sm">
                            {new Date(sub.lastTriggeredAt).toLocaleString('ko-KR')}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {sub.failureCount > 0 ? (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1 w-fit"
                          >
                            <AlertCircle className="h-3 w-3" />
                            {sub.failureCount}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50">
                            0
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>웹훅 삭제</AlertDialogTitle>
                              <AlertDialogDescription>
                                이 웹훅을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>취소</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(sub.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                삭제
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* 페이로드 형식 안내 */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">웹훅 페이로드 형식</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "event": "POST_CREATED | POST_UPDATED | POST_DELETED",
  "timestamp": "2025-12-04T12:00:00.000Z",
  "data": {
    "postId": "post_cuid",
    "title": "게시글 제목",
    "content": "게시글 내용",
    "authorId": "author_cuid",
    "categoryId": "category_cuid",
    "tags": ["태그1", "태그2"]
  }
}

// 헤더
X-Webhook-Signature: HMAC-SHA256 서명
X-Webhook-Event: 이벤트 타입`}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
