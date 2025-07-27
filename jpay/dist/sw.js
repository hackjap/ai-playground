// PairPay Service Worker
const CACHE_NAME = 'pairpay-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// 설치 이벤트 - 정적 리소스 캐시
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        // 새 서비스 워커를 즉시 활성화
        return self.skipWaiting()
      })
  )
})

// 활성화 이벤트 - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
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
  )
})

// Fetch 이벤트 - Network First 전략
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') {
    return
  }

  // Chrome extension 요청 무시
  if (event.request.url.startsWith('chrome-extension://')) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 성공적인 응답인 경우 캐시에 저장
        if (response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
        }
        return response
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 찾기
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response
            }
            
            // 캐시에도 없으면 오프라인 페이지 제공
            if (event.request.mode === 'navigate') {
              return caches.match('/')
            }
            
            // 기본 오류 응답
            return new Response('오프라인 상태입니다.', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=utf-8'
              })
            })
          })
      })
  )
})

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
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(urlsToCache))
    )
  }
})