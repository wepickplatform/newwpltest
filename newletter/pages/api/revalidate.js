export default async function handler(req, res) {
    // POST 요청만 허용
    if (req.method !== 'POST') {
      return res.status(405).send('허용되지 않는 메소드');
    }
    
    // 보안을 위한 시크릿 키 확인
    const { secret } = req.query;
    
    if (secret !== process.env.REVALIDATION_SECRET) {
      return res.status(401).json({ message: '유효하지 않은 토큰' });
    }
  
    try {
      const { type, slug } = req.body;
      
      // 홈페이지 재생성
      await res.revalidate('/');
      
      // 특정 콘텐츠 재생성
      if (slug) {
        if (type === 'post') {
          await res.revalidate(`/post/${slug}`);
        } else if (type === 'page') {
          await res.revalidate(`/page/${slug}`);
        }
      }
      
      return res.json({ revalidated: true, now: new Date().toISOString() });
    } catch (err) {
      return res.status(500).json({ message: '재생성 오류 발생', error: err.message });
    }
  }