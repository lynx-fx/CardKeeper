"use client"

import { useState } from "react"
import Navbar from "./navbar.jsx"
import "./../styles/dashboard.css"

export default function WarrantyDashboard() {
  const [warranties, setWarranties] = useState([
    {
      id: 1,
      productName: "iPhone 15 Pro",
      brand: "Apple",
      purchaseDate: "2024-01-15",
      warrantyExpiry: "2025-01-15",
      category: "Electronics",
      status: "Active",
    },
    {
      id: 2,
      productName: "Samsung Refrigerator",
      brand: "Samsung",
      purchaseDate: "2023-06-10",
      warrantyExpiry: "2025-06-10",
      category: "Appliances",
      status: "Active",
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newWarranty, setNewWarranty] = useState({
    productName: "",
    brand: "",
    purchaseDate: "",
    warrantyExpiry: "",
    category: "Electronics",
  })

  const handleAddWarranty = (e) => {
    e.preventDefault()
    const warranty = {
      id: Date.now(),
      ...newWarranty,
      status: "Active",
    }
    setWarranties([...warranties, warranty])
    setNewWarranty({
      productName: "",
      brand: "",
      purchaseDate: "",
      warrantyExpiry: "",
      category: "Electronics",
    })
    setShowAddForm(false)
  }

  const getStatusColor = (expiry) => {
    const today = new Date()
    const expiryDate = new Date(expiry)
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return "expired"
    if (daysUntilExpiry < 30) return "expiring-soon"
    return "active"
  }

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header-section">
            <h1>My Warranties</h1>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>
              Add Warranty
            </button>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{warranties.length}</h3>
              <p>Total Warranties</p>
            </div>
            <div className="stat-card">
              <h3>{warranties.filter((w) => getStatusColor(w.warrantyExpiry) === "active").length}</h3>
              <p>Active</p>
            </div>
            <div className="stat-card">
              <h3>{warranties.filter((w) => getStatusColor(w.warrantyExpiry) === "expiring-soon").length}</h3>
              <p>Expiring Soon</p>
            </div>
            <div className="stat-card">
              <h3>{warranties.filter((w) => getStatusColor(w.warrantyExpiry) === "expired").length}</h3>
              <p>Expired</p>
            </div>
          </div>

          <div className="warranties-grid">
            {warranties.map((warranty) => (
              <div key={warranty.id} className={`warranty-card ${getStatusColor(warranty.warrantyExpiry)}`}>
                <div className="warranty-header">
                  <h3>{warranty.productName}</h3>
                  <span className={`status-badge ${getStatusColor(warranty.warrantyExpiry)}`}>
                    {getStatusColor(warranty.warrantyExpiry).replace("-", " ")}
                  </span>
                </div>
                <div className="warranty-details">
                  <p>
                    <strong>Brand:</strong> {warranty.brand}
                  </p>
                  <p>
                    <strong>Category:</strong> {warranty.category}
                  </p>
                  <p>
                    <strong>Purchase Date:</strong> {warranty.purchaseDate}
                  </p>
                  <p>
                    <strong>Warranty Expires:</strong> {warranty.warrantyExpiry}
                  </p>
                </div>
                <div className="warranty-actions">
                  <button className="btn-small">View Details</button>
                  <button className="btn-small">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Warranty</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddWarranty} className="warranty-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={newWarranty.productName}
                  onChange={(e) => setNewWarranty({ ...newWarranty, productName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  value={newWarranty.brand}
                  onChange={(e) => setNewWarranty({ ...newWarranty, brand: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newWarranty.category}
                  onChange={(e) => setNewWarranty({ ...newWarranty, category: e.target.value })}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Purchase Date</label>
                <input
                  type="date"
                  value={newWarranty.purchaseDate}
                  onChange={(e) => setNewWarranty({ ...newWarranty, purchaseDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Warranty Expiry Date</label>
                <input
                  type="date"
                  value={newWarranty.warrantyExpiry}
                  onChange={(e) => setNewWarranty({ ...newWarranty, warrantyExpiry: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Warranty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
