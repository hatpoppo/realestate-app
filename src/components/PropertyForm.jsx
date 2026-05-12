import { useState } from 'react'

// 物件の新規登録・編集フォーム（モーダル表示）
// property が null の場合は新規登録、オブジェクトの場合は編集
export default function PropertyForm({ property, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState({
    name:       property?.name       ?? '',
    rent:       property?.rent       ?? '',
    area:       property?.area       ?? '',
    floor_plan: property?.floor_plan ?? '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      rent: Number(formData.rent),
    })
  }

  const isEdit = Boolean(property)

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? '物件を編集' : '物件を登録'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">物件名</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="例: サンシャイン渋谷 301号室"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rent">家賃（円）</label>
            <input
              id="rent"
              name="rent"
              type="number"
              value={formData.rent}
              onChange={handleChange}
              required
              min={1}
              placeholder="例: 120000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="area">エリア名</label>
            <input
              id="area"
              name="area"
              type="text"
              value={formData.area}
              onChange={handleChange}
              required
              placeholder="例: 東京都渋谷区"
            />
          </div>

          <div className="form-group">
            <label htmlFor="floor_plan">間取り</label>
            <input
              id="floor_plan"
              name="floor_plan"
              type="text"
              value={formData.floor_plan}
              onChange={handleChange}
              required
              placeholder="例: 1LDK"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={saving}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? '保存中...' : isEdit ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
