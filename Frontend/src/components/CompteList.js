"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import API_BASE_URL from "../config"

export default function CompteList({ refreshTrigger, newAccount }) {
    const [comptes, setComptes] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchId, setSearchId] = useState("")
    const [filteredComptes, setFilteredComptes] = useState([])
    const [editingCompte, setEditingCompte] = useState(null)
    const [showModal, setShowModal] = useState(false)

    const fetchComptes = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/comptes`)
            const data = Array.isArray(response.data) ? response.data : [response.data]
            setComptes(data)
            setFilteredComptes(data)
        } catch (error) {
            console.error("Error fetching comptes:", error)
            alert("⚠️ Impossible de charger les comptes. Veuillez réessayer.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (newAccount) {
            setComptes((prev) => [newAccount, ...prev])
            setFilteredComptes((prev) => [newAccount, ...prev])
        }
    }, [newAccount])

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchId(value)
        if (!value.trim()) {
            setFilteredComptes(comptes)
            return
        }
        const filtered = comptes.filter((compte) => compte.id?.toString().includes(value))
        setFilteredComptes(filtered)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("❗ Voulez-vous vraiment supprimer ce compte ?")) return
        try {
            await axios.delete(`${API_BASE_URL}/comptes/${id}`)
            setComptes((prev) => prev.filter((c) => c.id !== id))
            setFilteredComptes((prev) => prev.filter((c) => c.id !== id))
            alert("🗑️ Compte supprimé avec succès !")
        } catch (error) {
            console.error("Error deleting compte:", error)
            alert("⚠️ Une erreur est survenue lors de la suppression du compte.")
        }
    }

    const handleEditClick = (compte) => {
        setEditingCompte(compte)
        setShowModal(true)
    }

    const handleClearSearch = () => {
        setSearchId("")
        setFilteredComptes(comptes)
    }

    useEffect(() => {
        fetchComptes()
    }, [refreshTrigger])

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: "#f9fbfd" }}>
            <div className="card shadow-lg border-0 rounded-4">
                <div
                    className="card-header text-center text-white"
                    style={{
                        background: "linear-gradient(135deg, #00b4db 0%, #0083b0 100%)",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px"
                    }}
                >
                    <h2 className="mb-0">
                        <i className="bi bi-list-ul me-2"></i>Liste des Comptes
                    </h2>
                </div>

                <div className="card-body p-4">
                    <div className="mb-4">
                        <div className="row g-2">
                            <div className="col-md-6">
                                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search text-primary"></i>
                  </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 border rounded-3 bg-white shadow-sm"
                                        placeholder="Rechercher par ID de compte..."
                                        value={searchId}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                {searchId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary w-100 rounded-3"
                                        onClick={handleClearSearch}
                                    >
                                        <i className="bi bi-x-circle me-2"></i>Effacer la recherche
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-info" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                        </div>
                    ) : !filteredComptes.length ? (
                        <div className="alert alert-info text-center shadow-sm rounded-3" role="alert">
                            Aucun compte trouvé.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead style={{ backgroundColor: "#e9f3fc" }}>
                                <tr>
                                    <th>ID</th>
                                    <th>Solde (€)</th>
                                    <th>Date de création</th>
                                    <th>Type</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredComptes.map((compte) => (
                                    <tr key={compte.id}>
                                        <td>
                                            <span className="badge bg-primary rounded-pill px-3 py-2">{compte.id}</span>
                                        </td>
                                        <td>
                                            <strong className="text-success">
                                                {compte.solde?.toFixed(2) || "0.00"} €
                                            </strong>
                                        </td>
                                        <td>{compte.dateCreation}</td>
                                        <td>
                        <span
                            className={`badge ${
                                compte.type === "EPARGNE" ? "bg-info" : "bg-success"
                            } rounded-pill px-3 py-2`}
                        >
                          {compte.type}
                        </span>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-outline-warning me-2 rounded-3"
                                                onClick={() => handleEditClick(compte)}
                                            >
                                                <i className="bi bi-pencil-square"></i> Modifier
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-3"
                                                onClick={() => handleDelete(compte.id)}
                                            >
                                                <i className="bi bi-trash"></i> Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showModal && editingCompte && (
                <div
                    className="modal d-block"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1050,
                    }}
                >
                    <div className="modal-dialog" style={{ position: "relative", margin: "1.75rem auto" }}>
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div
                                className="modal-header text-dark"
                                style={{ background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" }}
                            >
                                <h5 className="modal-title">
                                    <i className="bi bi-pencil me-2"></i>Modifier le Compte
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body bg-light">
                                <EditCompteForm
                                    compte={editingCompte}
                                    onSuccess={() => {
                                        setEditingCompte(null)
                                        setShowModal(false)
                                        fetchComptes()
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- Sous-formulaire de modification ---
function EditCompteForm({ compte, onSuccess }) {
    const [formData, setFormData] = useState({
        solde: Number(compte.solde).toFixed(2) || "",
        dateCreation: compte.dateCreation || "",
        type: compte.type || "",
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        axios
            .put(`${API_BASE_URL}/comptes/${compte.id}`, formData)
            .then((res) => {
                alert("✅ Compte mis à jour avec succès !")
                setLoading(false)
                onSuccess(res.data)
            })
            .catch((error) => {
                console.error("Error updating compte:", error)
                alert("⚠️ Une erreur est survenue lors de la mise à jour du compte.")
                setLoading(false)
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label fw-semibold">Solde (€)</label>
                <input
                    type="number"
                    step="0.01"
                    className="form-control border rounded-3 shadow-sm"
                    name="solde"
                    value={formData.solde}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Date de création</label>
                <input
                    type="date"
                    className="form-control border rounded-3 shadow-sm"
                    name="dateCreation"
                    value={formData.dateCreation}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label fw-semibold">Type de compte</label>
                <select
                    className="form-select border rounded-3 shadow-sm"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Sélectionner un type</option>
                    <option value="COURANT">COURANT</option>
                    <option value="EPARGNE">EPARGNE</option>
                </select>
            </div>
            <button
                type="submit"
                className="btn w-100 text-white fw-semibold"
                disabled={loading}
                style={{
                    background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(253, 160, 133, 0.4)"
                }}
            >
                {loading ? "Mise à jour en cours..." : "Mettre à jour le Compte"}
            </button>
        </form>
    )
}
