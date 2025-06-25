"use client";

import { useState, useRef } from "react";
import Navbar from "./navbar.jsx";
import Loading from "./loading.jsx";
import "./../styles/dashboard.css";
import { toast } from "sonner";
import { useEffect } from "react";

export default function WarrantyDashboard() {
  const [warranties, setWarranties] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Image handling states
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);
  const detailFileInputRef = useRef(null);

  const VITE_HOST = import.meta.env.VITE_BACKEND;
  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState(null);
  const [deletingWarranty, setDeletingWarranty] = useState(null);

  useEffect(() => {
    loadCards();
    const today = new Date().toISOString().split("T")[0];
    setNewWarranty((prev) => ({
      ...prev,
      purchaseDate: today,
    }));
  }, []);

  // Image handling functions
  const handleImageSelect = (event, isDetailModal = false) => {
    const files = Array.from(event.target.files);
    const currentImages = isDetailModal
      ? selectedWarranty?.images?.length || 0
      : selectedImages.length;

    if (currentImages + files.length > MAX_IMAGES) {
      toast.error(
        `You can only upload up to ${MAX_IMAGES} images per warranty`
      );
      return;
    }

    const validFiles = [];
    const newPreviewUrls = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not an image.`);
        return;
      }

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      if (isDetailModal) {
        handleDetailImageUpload(validFiles);
      } else {
        setSelectedImages((prev) => [...prev, ...validFiles]);
        setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      }
    }

    // Reset file input
    event.target.value = "";
  };

  const removeImage = (index, isDetailModal = false) => {
    if (isDetailModal) {
      // Handle removing images from existing warranty
      handleRemoveDetailImage(index);
    } else {
      // Handle removing images from form
      URL.revokeObjectURL(imagePreviewUrls[index]);
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDetailImageUpload = async (files) => {
    if (!selectedWarranty) return;

    setUploadingImages(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("img", file);
    });
    formData.append("cardId", selectedWarranty.id);

    try {
      const response = await fetch(`${VITE_HOST}/api/card/addImages`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Images uploaded successfully");
        // Refresh the warranty data
        setWarranties([]);
        await loadCards();
        setShowDetailModal(false);
        // Update the selected warranty with new images
        const updatedWarranty = warranties.find(
          (w) => w.id === selectedWarranty.id
        );
        if (updatedWarranty) {
          setSelectedWarranty(updatedWarranty);
        }
      } else {
        toast.error(data.message || "Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveDetailImage = async (imageIndex) => {
    if (!selectedWarranty || !selectedWarranty.images[imageIndex]) return;

    try {
      const response = await fetch(`${VITE_HOST}/api/card/removeImage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId: selectedWarranty.id,
          imageIndex: imageIndex,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Image removed successfully");
        // Update the selected warranty
        const updatedImages = selectedWarranty.images.filter(
          (_, i) => i !== imageIndex
        );
        setSelectedWarranty((prev) => ({
          ...prev,
          images: updatedImages,
        }));

        // Adjust selected image index if necessary
        if (
          selectedImageIndex >= updatedImages.length &&
          updatedImages.length > 0
        ) {
          setSelectedImageIndex(updatedImages.length - 1);
        } else if (updatedImages.length === 0) {
          setSelectedImageIndex(0);
        }

        // Refresh warranties list
        setWarranties([]);
        await loadCards();
      } else {
        toast.error(data.message || "Failed to remove image");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const clearImages = () => {
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const handleAddWarranty = async (e) => {
    e.preventDefault();

    // Calculating expiry date
    const { purchaseDate, warrantyValidation } = newWarranty;
    let warrantyExpiry = "";

    if (purchaseDate && warrantyValidation) {
      const date = new Date(purchaseDate);
      date.setFullYear(
        date.getFullYear() + Number.parseInt(warrantyValidation)
      );
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      warrantyExpiry = new Date(`${year}-${month}-${day}`);
    }

    try {
      setIsLoading(true);

      // Create FormData for warranty with images
      const formData = new FormData();

      // Add warranty data
      Object.keys(newWarranty).forEach((key) => {
        formData.append(key, newWarranty[key]);
      });
      formData.append("warrantyExpiry", warrantyExpiry);

      // Add images
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(`${VITE_HOST}/api/card/createCard`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        toast.success(data.message || "Card added successfully");

        // Reset form and images
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
        clearImages();

        setWarranties([]);
        loadCards();
        setShowAddForm(false);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding warranty:", error);
      toast.error("Failed to add warranty. Please try again.");
      setIsLoading(false);
    }
  };

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${VITE_HOST}/api/card/getCard`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      setIsLoading(false);

      const data = await response.json();
      if (response.ok && data.success) {
        const formattedWarranties = data.cards
          .map((card) => ({
            id: card._id,
            productName: card.productName,
            brand: card.brand,
            purchaseDate: card.purchaseDate.split("T")[0],
            warrantyExpiry: card.warrantyExpiry.split("T")[0],
            category: card.category,
            status:
              new Date(card.warrantyExpiry) >= new Date().setHours(0, 0, 0, 0)
                ? "Active"
                : "Expired",
            purchasePrice: `$${card.purchasePrice}`,
            store: card.store,
            serialNumber: card.serialNumber,
            warrantyType: card.warrantyType,
            description: card.description,
            isActive: card.isActive,
            images: card.images || [],
          }))
          .filter((warranty) => warranty.isActive);

        setWarranties((prev) => [...prev, ...formattedWarranties]);
      } else {
        setTimeout(() => {
          toast.error(data.message || "Something went wrong");
        }, 3000);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const handleViewDetails = (warranty) => {
    setSelectedWarranty(warranty);
    setSelectedImageIndex(0);
    setShowDetailModal(true);
  };

  const handleEditWarranty = (warranty) => {
    setShowDetailModal(false);
    setEditingWarranty(warranty);
    setNewWarranty({
      productName: warranty.productName,
      brand: warranty.brand,
      purchaseDate: warranty.purchaseDate,
      warrantyValidation: Math.ceil(
        (new Date(warranty.warrantyExpiry) - new Date(warranty.purchaseDate)) /
          (365.25 * 24 * 60 * 60 * 1000)
      ),
      category: warranty.category,
      purchasePrice: warranty.purchasePrice.replace("$", ""),
      store: warranty.store,
      serialNumber: warranty.serialNumber,
      warrantyType: warranty.warrantyType,
      description: warranty.description,
    });
    setShowEditForm(true);
  };

  const handleDeleteWarranty = (warranty) => {
    setShowDetailModal(false);
    setDeletingWarranty(warranty);
    setShowDeleteModal(true);
  };

  const handleUpdateWarranty = async (e) => {
    e.preventDefault();

    const { purchaseDate, warrantyValidation } = newWarranty;
    let warrantyExpiry = "";

    if (purchaseDate && warrantyValidation) {
      const date = new Date(purchaseDate);
      date.setFullYear(
        date.getFullYear() + Number.parseInt(warrantyValidation)
      );
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      warrantyExpiry = new Date(`${year}-${month}-${day}`);
    }

    const warrantyData = {
      ...newWarranty,
      warrantyExpiry,
    };

    try {
      setIsLoading(true);
      const response = await fetch(`${VITE_HOST}/api/card/updateCard`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: warrantyData.productName,
          brand: warrantyData.brand,
          purchaseDate: warrantyData.purchaseDate,
          warrantyExpiry: warrantyData.warrantyExpiry,
          category: warrantyData.category,
          purchasePrice: warrantyData.purchasePrice,
          store: warrantyData.store,
          serialNumber: warrantyData.serialNumber,
          warrantyType: warrantyData.warrantyType,
          description: warrantyData.description,
          cardId: editingWarranty.id,
        }),
        credentials: "include",
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        toast.success(data.message || "Card updated successfully");
        setWarranties([]);
        loadCards();
        setShowEditForm(false);
        setEditingWarranty(null);
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
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating warranty:", error);
      toast.error("Failed to update warranty. Please try again.");
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${VITE_HOST}/api/card/deleteCard`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cardId: selectedWarranty.id,
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        toast.success(data.message || "Card deleted successfully");
        setWarranties([]);
        loadCards();
        setShowDeleteModal(false);
        setDeletingWarranty(null);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error deleting warranty:", error);
      toast.error("Failed to delete warranty. Please try again.");
      setIsLoading(false);
    }
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
    <>
      {isLoading && <Loading />}
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
                {warranties.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <div className="empty-state-icon">📋</div>
                      <h3>No Warranties Found</h3>
                      <p>
                        You haven't added any warranty cards yet. Start by
                        adding your first warranty to keep track of your
                        products.
                      </p>
                      <button
                        className="btn-primary"
                        onClick={() => setShowAddForm(true)}
                      >
                        Add Your First Warranty
                      </button>
                    </div>
                  </div>
                ) : (
                  warranties.map((warranty) => (
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
                        {warranty.images && warranty.images.length > 0 ? (
                          <img
                            src={`${VITE_HOST}/images/${warranty.images[1]}`}
                            alt={`${warranty.productName} warranty`}
                            className="warranty-thumbnail"
                          />
                        ) : (
                          <div className="warranty-thumbnail-placeholder">
                            <span>📷</span>
                            <p>No Image</p>
                          </div>
                        )}
                        {warranty.images && warranty.images.length > 1 && (
                          <div className="image-count-badge">
                            +{warranty.images.length - 1}
                          </div>
                        )}
                      </div>

                      <div className="warranty-details">
                        <p>
                          <strong>Brand:</strong> {warranty.brand}
                        </p>
                        <p>
                          <strong>Category:</strong> {warranty.category}
                        </p>
                        <p>
                          <strong>Purchase Date:</strong>{" "}
                          {warranty.purchaseDate}
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
                        <button
                          className="btn-small"
                          onClick={() => handleEditWarranty(warranty)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-small btn-danger"
                          onClick={() => handleDeleteWarranty(warranty)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
                  onClick={() => {
                    setShowAddForm(false);
                    clearImages();
                  }}
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
                        setNewWarranty({
                          ...newWarranty,
                          brand: e.target.value,
                        })
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
                        setNewWarranty({
                          ...newWarranty,
                          store: e.target.value,
                        })
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

                {/* Image Upload Section */}
                <div className="form-group">
                  <label>
                    Warranty Images ({selectedImages.length}/{MAX_IMAGES})
                  </label>
                  <div className="image-upload-section">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleImageSelect(e, false)}
                      accept="image/*"
                      multiple
                      style={{ display: "none" }}
                    />

                    {selectedImages.length < MAX_IMAGES && (
                      <div
                        className="image-upload-area"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="upload-placeholder">
                          <span>📷</span>
                          <p>Click to upload warranty images</p>
                          <small>
                            Drag & drop or click to browse (Max {MAX_IMAGES}{" "}
                            images, 5MB each)
                          </small>
                        </div>
                      </div>
                    )}

                    {imagePreviewUrls.length > 0 && (
                      <div className="image-preview-grid">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="image-preview-item">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(index, false)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      clearImages();
                    }}
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

        {/* Edit Warranty Modal */}
        {showEditForm && editingWarranty && (
          <div className="modal-overlay">
            <div className="modal large-modal">
              <div className="modal-header">
                <h2>Edit Warranty</h2>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingWarranty(null);
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateWarranty} className="warranty-form">
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
                        setNewWarranty({
                          ...newWarranty,
                          brand: e.target.value,
                        })
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
                      placeholder="0.00"
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
                        setNewWarranty({
                          ...newWarranty,
                          store: e.target.value,
                        })
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
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingWarranty(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Update Warranty
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingWarranty && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Delete Warranty</h2>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingWarranty(null);
                  }}
                >
                  ×
                </button>
              </div>
              <div className="delete-modal-content">
                <div className="delete-warning">
                  <div className="warning-icon">⚠️</div>
                  <h3>Are you sure you want to delete this warranty?</h3>
                  <p>
                    You are about to permanently delete the warranty for{" "}
                    <strong>{deletingWarranty.productName}</strong> by{" "}
                    <strong>{deletingWarranty.brand}</strong>.
                  </p>
                  <p className="warning-text">
                    This action cannot be undone. All warranty information will
                    be permanently removed.
                  </p>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletingWarranty(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={handleConfirmDelete}
                  >
                    Delete Warranty
                  </button>
                </div>
              </div>
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
                    {selectedWarranty.images &&
                    selectedWarranty.images.length > 0 ? (
                      <img
                        src={`${VITE_HOST}/images/${selectedWarranty.images[selectedImageIndex]}`}
                        alt={`${selectedWarranty.productName} warranty document`}
                        className="detail-main-image"
                      />
                    ) : (
                      <div className="detail-main-image-placeholder">
                        <span>📷</span>
                        <p>No Image Available</p>
                      </div>
                    )}
                  </div>

                  {selectedWarranty.images &&
                    selectedWarranty.images.length > 1 && (
                      <div className="image-thumbnails">
                        {selectedWarranty.images.map((image, index) => (
                          <div key={index} className="thumbnail-container">
                            <img
                              src={`${VITE_HOST}/images/${image}`}
                              alt={`Warranty document ${index + 1}`}
                              className={`thumbnail ${
                                index === selectedImageIndex ? "active" : ""
                              }`}
                              onClick={() => setSelectedImageIndex(index)}
                            />
                            <button
                              className="remove-thumbnail-btn"
                              onClick={() => handleRemoveDetailImage(index)}
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                  {selectedWarranty.images &&
                    selectedWarranty.images.length === 1 && (
                      <div className="single-image-actions">
                        <button
                          className="btn-danger btn-small"
                          onClick={() => handleRemoveDetailImage(0)}
                        >
                          Remove Image
                        </button>
                      </div>
                    )}

                  {(!selectedWarranty.images ||
                    selectedWarranty.images.length < MAX_IMAGES) && (
                    <div className="image-upload-area">
                      <input
                        type="file"
                        ref={detailFileInputRef}
                        onChange={(e) => handleImageSelect(e, true)}
                        accept="image/*"
                        multiple
                        style={{ display: "none" }}
                      />
                      <div
                        className="upload-placeholder"
                        onClick={() => detailFileInputRef.current?.click()}
                      >
                        {uploadingImages ? (
                          <div className="uploading-indicator">
                            <span>⏳</span>
                            <p>Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <span>📷</span>
                            <p>Click to upload warranty images</p>
                            <small>
                              {selectedWarranty.images
                                ? `${
                                    MAX_IMAGES - selectedWarranty.images.length
                                  } more images allowed`
                                : `Up to ${MAX_IMAGES} images allowed`}
                            </small>
                          </>
                        )}
                      </div>
                    </div>
                  )}
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
                    <button
                      className="btn-primary"
                      onClick={() => handleEditWarranty(selectedWarranty)}
                    >
                      Edit Warranty
                    </button>
                    <button className="btn-secondary">Download PDF</button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeleteWarranty(selectedWarranty)}
                    >
                      Delete Warranty
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
