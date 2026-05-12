import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PropertyForm from '../components/PropertyForm'

export default function Properties() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [showForm, setShowForm]     = useState(false)   // フォームモーダルの表示制御
  const [editingProperty, setEditingProperty] = useState(null) // 編集中の物件（null = 新規）
  const [saving, setSaving]         = useState(false)

  // ── SELECT: ログインユーザーの物件一覧を取得 ──
  const fetchProperties = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // ── INSERT / UPDATE: フォームの保存ボタン押下時 ──
  const handleSave = async (formData) => {
    setSaving(true)
    setError('')

    if (editingProperty) {
      // UPDATE: 既存物件の更新
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', editingProperty.id)

      if (error) {
        setError('更新に失敗しました: ' + error.message)
        setSaving(false)
        return
      }
    } else {
      // INSERT: 新規物件の登録（user_id はサーバー側 RLS と一致させるため明示的にセット）
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('properties')
        .insert({ ...formData, user_id: user.id })

      if (error) {
        setError('登録に失敗しました: ' + error.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setShowForm(false)
    setEditingProperty(null)
    // 保存後に一覧を再取得
    fetchProperties()
  }

  // ── DELETE: 削除ボタン押下時 ──
  const handleDelete = async (id, name) => {
    if (!window.confirm(`「${name}」を削除してもよいですか？`)) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      // 再取得せずにローカル state から除去してレスポンスを向上
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // 編集ボタン押下: 対象物件をセットしてフォームを開く
  const handleEdit = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  // フォームを閉じる
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="properties-container">
      <header className="properties-header">
        <h1>物件一覧</h1>
        <div className="header-actions">
          <button
            className="btn-add"
            onClick={() => { setEditingProperty(null); setShowForm(true) }}
          >
            ＋ 新規登録
          </button>
          <button onClick={handleLogout} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p className="loading-text">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty-text">登録されている物件がありません。</p>
      ) : (
        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <h2 className="property-name">{property.name}</h2>
              <p className="property-area">📍 {property.area}</p>
              <p className="property-floor-plan">🏠 {property.floor_plan}</p>
              <p className="property-rent">
                月額 <span>{property.rent.toLocaleString()}</span> 円
              </p>
              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(property)}
                >
                  編集
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(property.id, property.name)}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新規登録・編集モーダル */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSave={handleSave}
          onCancel={handleCancelForm}
          saving={saving}
        />
      )}
    </div>
  )
}
