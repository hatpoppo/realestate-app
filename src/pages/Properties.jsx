import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// ダミーの物件データ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'サンシャイン渋谷 301号室', rent: 120000, area: '東京都渋谷区' },
  { id: 2, name: 'グリーンヒルズ新宿 205号室', rent: 95000, area: '東京都新宿区' },
  { id: 3, name: 'ブルースカイ品川 501号室', rent: 150000, area: '東京都品川区' },
  { id: 4, name: 'リバーサイド浅草 102号室', rent: 78000, area: '東京都台東区' },
  { id: 5, name: 'パークビュー目黒 404号室', rent: 130000, area: '東京都目黒区' },
  { id: 6, name: 'コスモス吉祥寺 303号室', rent: 88000, area: '東京都武蔵野市' },
]

export default function Properties() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // ログアウト後はログイン画面へリダイレクト
    navigate('/login')
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <button onClick={handleLogout} className="btn-logout">
          ログアウト
        </button>
      </header>

      <div className="properties-grid">
        {DUMMY_PROPERTIES.map((property) => (
          <div key={property.id} className="property-card">
            <h2 className="property-name">{property.name}</h2>
            <p className="property-area">📍 {property.area}</p>
            <p className="property-rent">
              月額 <span>{property.rent.toLocaleString()}</span> 円
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
