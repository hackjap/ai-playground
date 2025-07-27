// PairPay Service Worker with Workbox-inspired strategies
const CACHE_NAME = 'pairpay-v1.2'
const STATIC_CACHE_NAME = 'pairpay-static-v1.2'
const RUNTIME_CACHE_NAME = 'pairpay-runtime-v1.2'

// 정적 리소스 캐시
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico'
]

// API 및 동적 콘텐츠는 런타임 캐시 사용
const API_CACHE_PATTERNS = [
  /^https:\/\/.*\.supabase\.co\//,
  /\/api\//
]

// 이미지 및 폰트 캐시 패턴
const ASSET_CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:woff|woff2|ttf|eot)$/
]

// 설치 이벤트 - 정적 리소스 캐시
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        // 새 서비스 워커를 즉시 활성화
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Cache installation failed:', error)
      })
  )
})

// 활성화 이벤트 - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  const expectedCaches = [STATIC_CACHE_NAME, RUNTIME_CACHE_NAME]
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => !expectedCaches.includes(cacheName))
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        // 모든 클라이언트에서 새 서비스 워커 제어
        return self.clients.claim()
      })
      .catch((error) => {
        console.error('Cache cleanup failed:', error)
      })
  )
})

// Fetch 이벤트 - 캐싱 전략 선택
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return
  }

  // Chrome extension 요청 무시
  if (event.request.url.startsWith('chrome-extension://') || 
      event.request.url.startsWith('moz-extension://')) {
    return
  }

  const url = new URL(event.request.url)
  
  // 정적 리소스: Cache First 전략
  if (STATIC_CACHE_URLS.some(staticUrl => url.pathname === staticUrl) ||
      ASSET_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(event.request))
    return
  }
  
  // API 요청: Network First 전략
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(networkFirst(event.request))
    return
  }
  
  // 네비게이션 요청: Network First with fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(navigationHandler(event.request))
    return
  }
  
  // 기타 요청: Network First
  event.respondWith(networkFirst(event.request))
})

// Cache First 전략 - 정적 리소스용
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Cache first failed:', error)
    throw error
  }
}

// Network First 전략 - API 요청용
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Network failed, trying cache:', error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// 네비게이션 핸들러
async function navigationHandler(request) {
  try {
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    console.log('Navigation network failed, serving app shell')
    const appShell = await caches.match('/')
    if (appShell) {
      return appShell
    }
    
    return new Response('오프라인 상태입니다. 인터넷 연결을 확인해주세요.', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html; charset=utf-8'
      })
    })
  }
}

// 백그라운드 동기화 (향후 사용)
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'expense-sync') {
    event.waitUntil(
      // 향후 오프라인에서 생성된 지출 데이터 동기화
      syncExpenses()
    )
  }
})

// 푸시 알림 처리 (향후 사용)
self.addEventListener('push', (event) => {
  console.log('Push message received:', event)
  
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: '확인',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('PairPay', options)
  )
})

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// 유틸리티 함수들
async function syncExpenses() {
  // 향후 구현: 로컬에 저장된 오프라인 지출 데이터를 서버와 동기화
  console.log('Syncing expenses...')
  return Promise.resolve()
}

// 서비스 워커 메시지 처리
self.addEventListener('message', (event) => {
  console.log('SW received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.payload
    event.waitUntil(
      caches.open(RUNTIME_CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
    )
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size })
      })
    )
  }
}

// 캐시 크기 조회 유틸리티
async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()
    totalSize += requests.length
  }
  
  return totalSize
})