"use client";

import { useState } from "react";
import Navbar from "./navbar.jsx";
import "./../styles/dashboard.css";

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
      purchasePrice: "$999.00",
      store: "Apple Store",
      serialNumber: "ABC123456789",
      warrantyType: "Limited Warranty",
      description:
        "Latest iPhone with advanced camera system and titanium design.",
      images: [
        "https://th.bing.com/th/id/OIP.HBbuY78PlcRT1X9nq2xZ0AHaHa?o=7&cb=thvnextc1rm=3&rs=1&pid=ImgDetMain",
        "https://www.techspot.com/images/products/2023/smartphones/org/2023-09-19-product.jpg",
      ],
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [newWarranty, setNewWarranty] = useState({
    productName: "",
    brand: "",
    purchaseDate: "",
    warrantyValidation: 0,
    category: "Electronics",
    purchasePrice: "",
    store: "",
    serialNumber: "",
    warrantyType: "Limited Warranty",
    description: "",
  });

  const handleAddWarranty = async (e) => {
    e.preventDefault();

    // 1. Calculate expiry date
    const { purchaseDate, warrantyValidation } = newWarranty;
    let warrantyExpiry = "";

    if (purchaseDate && warrantyValidation) {
      const date = new Date(purchaseDate);
      date.setFullYear(date.getFullYear() + parseInt(warrantyValidation));
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      warrantyExpiry = `${year}-${month}-${day}`;
    }

    // 2. Prepare data for API (with calculated expiry)
    const warrantyData = {
      ...newWarranty,
      warrantyExpiry, // Override with calculated expiry
      // status: "Active",
      // images: ["/placeholder.svg?height=300&width=400&text=Upload+Warranty+Card"],
    };

    // 3. API Call (replace with your actual API call)
    try {
      const response = await fetch("/api/warranties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(warrantyData),
      });

      if (!response.ok) throw new Error("Failed to add warranty");

      // 4. Reset form (no local state update for warranties)
      setNewWarranty({
        productName: "",
        brand: "",
        purchaseDate: "",
        warrantyValidation: 0,
        category: "Electronics",
        purchasePrice: "",
        store: "",
        serialNumber: "",
        warrantyType: "Limited Warranty",
        description: "",
      });
      setShowAddForm(false);

      // Optional: Show success message
      alert("Warranty added successfully!");
    } catch (error) {
      console.error("Error adding warranty:", error);
      alert("Failed to add warranty. Please try again.");
    }
  };

  const handleViewDetails = (warranty) => {
    setSelectedWarranty(warranty);
    setSelectedImageIndex(0);
    setShowDetailModal(true);
  };

  const getStatusColor = (expiry) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const daysUntilExpiry = Math.ceil(
      (expiryDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry < 30) return "expiring-soon";
    return "active";
  };

  const getDaysRemaining = (expiry) => {
    const today = new Date();
    const expiryDate = new Date(expiry);
    const daysUntilExpiry = Math.ceil(
      (expiryDate - today) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0)
      return `Expired ${Math.abs(daysUntilExpiry)} days ago`;
    if (daysUntilExpiry === 0) return "Expires today";
    if (daysUntilExpiry === 1) return "Expires tomorrow";
    return `${daysUntilExpiry} days remaining`;
  };

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header-section">
            <div className="dashboard-title">
              <h1>My Warranties</h1>
              <p>Manage and track all your warranty information</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              Add Warranty
            </button>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>{warranties.length}</h3>
                <p>Total Warranties</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>
                  {
                    warranties.filter(
                      (w) => getStatusColor(w.warrantyExpiry) === "active"
                    ).length
                  }
                </h3>
                <p>Active</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>
                  {
                    warranties.filter(
                      (w) =>
                        getStatusColor(w.warrantyExpiry) === "expiring-soon"
                    ).length
                  }
                </h3>
                <p>Expiring Soon</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <h3>
                  {
                    warranties.filter(
                      (w) => getStatusColor(w.warrantyExpiry) === "expired"
                    ).length
                  }
                </h3>
                <p>Expired</p>
              </div>
            </div>
          </div>

          <div className="warranties-section">
            <div className="section-header">
              <h2>Your Warranties</h2>
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search warranties..."
                  className="search-input"
                />
                <select className="filter-select">
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="warranties-grid">
              {warranties.map((warranty) => (
                <div
                  key={warranty.id}
                  className={`warranty-card ${getStatusColor(
                    warranty.warrantyExpiry
                  )}`}
                >
                  <div className="warranty-header">
                    <h3>{warranty.productName}</h3>
                    <span
                      className={`status-badge ${getStatusColor(
                        warranty.warrantyExpiry
                      )}`}
                    >
                      {getStatusColor(warranty.warrantyExpiry).replace(
                        "-",
                        " "
                      )}
                    </span>
                  </div>

                  <div className="warranty-image">
                    <img
                      src={
                        warranty.images?.[0] ||
                        "/placeholder.svg?height=150&width=200&text=No+Image"
                      }
                      alt={`${warranty.productName} warranty`}
                      className="warranty-thumbnail"
                    />
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
                      <strong>Expires:</strong> {warranty.warrantyExpiry}
                    </p>
                    <p
                      className={`warranty-status ${getStatusColor(
                        warranty.warrantyExpiry
                      )}`}
                    >
                      <strong>
                        {getDaysRemaining(warranty.warrantyExpiry)}
                      </strong>
                    </p>
                  </div>

                  <div className="warranty-actions">
                    <button
                      className="btn-small btn-primary"
                      onClick={() => handleViewDetails(warranty)}
                    >
                      View Details
                    </button>
                    <button className="btn-small">Edit</button>
                    <button className="btn-small btn-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Warranty Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>Add New Warranty</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddWarranty} className="warranty-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={newWarranty.productName}
                    onChange={(e) =>
                      setNewWarranty({
                        ...newWarranty,
                        productName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    value={newWarranty.brand}
                    onChange={(e) =>
                      setNewWarranty({ ...newWarranty, brand: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newWarranty.category}
                    onChange={(e) =>
                      setNewWarranty({
                        ...newWarranty,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Purchase Price</label>
                  <input
                    type="number"
                    value={newWarranty.purchasePrice}
                    onChange={(e) =>
                      setNewWarranty({
                        ...newWarranty,
                        purchasePrice: e.target.value,
                      })
                    }
                    placeholder="$0.00"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Purchase Date</label>
                  <input
                    type="date"
                    value={newWarranty.purchaseDate}
                    onChange={(e) =>
                      setNewWarranty({
                        ...newWarranty,
                        purchaseDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Warranty Validation Period</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="In years"
                    value={newWarranty.warrantyValidation}
                    onChange={(e) =>
                      setNewWarranty({
                        ...newWarranty,
                        warrantyValidation: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Store/Retailer</label>
                  <input
                    type="text"
                    value={newWarranty.store}
                    onChange={(e) =>
                      setNewWarranty({ ...newWarranty, store: e.target.value })
                    }
                    placeholder="Where did you buy this?"
                  />
                </div>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    value={newWarranty.serialNumber}
                    onChange={(e) =>
                      setNewWarranty({
                        ...newWarranty,
                        serialNumber: e.target.value,
                      })
                    }
                    placeholder="Product serial number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Warranty Type</label>
                <select
                  value={newWarranty.warrantyType}
                  onChange={(e) =>
                    setNewWarranty({
                      ...newWarranty,
                      warrantyType: e.target.value,
                    })
                  }
                >
                  <option value="Limited Warranty">Limited Warranty</option>
                  <option value="Extended Warranty">Extended Warranty</option>
                  <option value="Manufacturer Warranty">
                    Manufacturer Warranty
                  </option>
                  <option value="Store Warranty">Store Warranty</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newWarranty.description}
                  onChange={(e) =>
                    setNewWarranty({
                      ...newWarranty,
                      description: e.target.value,
                    })
                  }
                  placeholder="Additional notes about this product..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
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

      {/* Warranty Details Modal */}
      {showDetailModal && selectedWarranty && (
        <div className="modal-overlay">
          <div className="modal detail-modal">
            <div className="modal-header">
              <h2>{selectedWarranty.productName}</h2>
              <button
                className="close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className="detail-content">
              <div className="detail-images">
                <div className="main-image">
                  <img
                    src={
                      selectedWarranty.images?.[selectedImageIndex] ||
                      "/placeholder.svg?height=400&width=500&text=No+Image"
                    }
                    alt={`${selectedWarranty.productName} warranty document`}
                    className="detail-main-image"
                  />
                </div>

                {selectedWarranty.images &&
                  selectedWarranty.images.length > 1 && (
                    <div className="image-thumbnails">
                      {selectedWarranty.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Warranty document ${index + 1}`}
                          className={`thumbnail ${
                            index === selectedImageIndex ? "active" : ""
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                          height={400}
                          width={300}
                        />
                      ))}
                    </div>
                  )}

                <div className="image-upload-area">
                  <div className="upload-placeholder">
                    <span>📷</span>
                    <p>Click to upload warranty images</p>
                    <small>Drag & drop or click to browse</small>
                  </div>
                </div>
              </div>

              <div className="detail-info">
                <div className="warranty-status-section">
                  <span
                    className={`status-badge large ${getStatusColor(
                      selectedWarranty.warrantyExpiry
                    )}`}
                  >
                    {getStatusColor(selectedWarranty.warrantyExpiry).replace(
                      "-",
                      " "
                    )}
                  </span>
                  <p className="status-text">
                    {getDaysRemaining(selectedWarranty.warrantyExpiry)}
                  </p>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Brand</label>
                    <span>{selectedWarranty.brand}</span>
                  </div>
                  <div className="detail-item">
                    <label>Category</label>
                    <span>{selectedWarranty.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Purchase Date</label>
                    <span>{selectedWarranty.purchaseDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Warranty Expires</label>
                    <span>{selectedWarranty.warrantyExpiry}</span>
                  </div>
                  <div className="detail-item">
                    <label>Purchase Price</label>
                    <span>
                      {selectedWarranty.purchasePrice || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Store</label>
                    <span>{selectedWarranty.store || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Serial Number</label>
                    <span>
                      {selectedWarranty.serialNumber || "Not specified"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Warranty Type</label>
                    <span>
                      {selectedWarranty.warrantyType || "Not specified"}
                    </span>
                  </div>
                </div>

                {selectedWarranty.description && (
                  <div className="description-section">
                    <label>Description</label>
                    <p>{selectedWarranty.description}</p>
                  </div>
                )}

                <div className="detail-actions">
                  <button className="btn-primary">Edit Warranty</button>
                  <button className="btn-secondary">Download PDF</button>
                  <button className="btn-danger">Delete Warranty</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
