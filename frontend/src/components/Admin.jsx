import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

// Ajout des composants d'icônes animés
const AnimatedIcon = ({ icon, color = "brand" }) => (
  <div className={`relative group w-8 h-8 flex items-center justify-center`}>
    <div className={`absolute inset-0 bg-${color}-500/20 rounded-lg blur group-hover:bg-${color}-500/30 transition-all duration-300`}></div>
    <i className={`fas ${icon} text-${color}-500 group-hover:scale-110 transition-transform duration-300`}></i>
  </div>
);

// Ajout du composant de carte statistique
const StatCard = ({ title, value, icon, color = "brand" }) => (
  <div className="bg-dark-800/50 backdrop-blur-xl rounded-xl border border-dark-700 p-4 hover:border-brand-500/50 transition-all duration-300 group">
    <div className="flex items-center space-x-4">
      <AnimatedIcon icon={icon} color={color} />
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {value}
        </p>
      </div>
    </div>
    <div className="mt-4 h-1 bg-dark-700 rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 w-[70%] group-hover:w-full transition-all duration-700`}></div>
    </div>
  </div>
);

function Admin() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [editingUserId, setEditingUserId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [debiteurs, setDebiteurs] = useState([]);
  const [importMessage, setImportMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedDebiteurs, setSelectedDebiteurs] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [hoveredEmployee, setHoveredEmployee] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEmployeesForImport, setSelectedEmployeesForImport] = useState([]);
  const [editingDebiteur, setEditingDebiteur] = useState(null);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    montant_credit: 0
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState(null);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [activeView, setActiveView] = useState('users');
  const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editEmployeeForm, setEditEmployeeForm] = useState({
    matricule: '',
    name: '',
    email: '',
    departement: '',
    poste: '',
    date_embauche: '',
    salaire: '',
    telephone: '',
    adresse: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchUsers();
    fetchEmployees();
    fetchDebiteurs();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    }
  };

  const fetchDebiteurs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/debiteurs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        params: {
          page: currentPage,
          per_page: itemsPerPage,
          search: searchTerm
        }
      });

      if (response.data.data) {
        setDebiteurs(response.data.data);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setDebiteurs(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des débiteurs:', error);
      setImportMessage(
        'Erreur lors du chargement des débiteurs : ' + 
        (error.response?.data?.message || 'Une erreur est survenue')
      );
      
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs
    if (!name.trim()) {
      setImportMessage('Le nom est requis');
      return;
    }
    if (!email.trim()) {
      setImportMessage('L\'email est requis');
      return;
    }
    if (!editingUserId && !password.trim()) {
      setImportMessage('Le mot de passe est requis pour un nouvel utilisateur');
      return;
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setImportMessage('Format d\'email invalide');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      let response;
      if (editingUserId) {
        // Mise à jour d'un utilisateur existant
        response = await axios.put(
          `/users/${editingUserId}`, 
          { name, email, role },
          { headers }
        );
      } else {
        // Création d'un nouvel utilisateur
        // Validation supplémentaire du mot de passe
        if (password.length < 6) {
          setImportMessage('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }
        
        response = await axios.post(
          '/users', 
          { name, email, password, role }, 
          { headers }
        );
      }

      if (response.data) {
        setImportMessage(editingUserId ? 'Utilisateur mis à jour avec succès' : 'Utilisateur créé avec succès');
        resetForm();
        await Promise.all([
          fetchUsers(),
          fetchEmployees()
        ]);
      }
    } catch (error) {
      console.error('Error during user operation:', error);
      
      // Gestion détaillée des erreurs
      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Une erreur est survenue lors du traitement de la requête';
        
        switch (error.response.status) {
          case 422:
            // Erreur de validation
            const validationErrors = error.response.data?.errors;
            if (validationErrors) {
              const errorMessages = Object.values(validationErrors).flat();
              setImportMessage(`Erreur de validation: ${errorMessages.join(', ')}`);
            } else {
              setImportMessage(`Erreur de validation: ${errorMessage}`);
            }
            break;
          case 401:
            setImportMessage('Session expirée. Veuillez vous reconnecter.');
            navigate('/signin');
            break;
          case 403:
            setImportMessage('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
            break;
          case 409:
            setImportMessage('Un utilisateur avec cet email existe déjà.');
            break;
          default:
            setImportMessage(`Erreur: ${errorMessage}`);
        }
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        setImportMessage('Erreur de connexion au serveur. Veuillez réessayer.');
      } else {
        // Erreur lors de la configuration de la requête
        setImportMessage('Erreur lors de la préparation de la requête.');
      }
    }
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Rafraîchir les deux listes
      await Promise.all([
        fetchUsers(),
        fetchEmployees()
      ]);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('user');
    setEditingUserId(null);
    setImportMessage('');
  };

  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (selectedEmployeesForImport.length === 0) {
        setImportMessage('Veuillez sélectionner au moins un employé pour l\'attribution');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    selectedEmployeesForImport.forEach((id, index) => {
        formData.append(`employee_ids[${index}]`, id);
    });

    try {
        const token = localStorage.getItem('token');
        setImportMessage('Import et attribution en cours...');
        
        const response = await axios.post('/debiteurs/import', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        
        setImportMessage(response.data.message);
        await refreshData();
    } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        setImportMessage(
            'Erreur lors de l\'import : ' + 
            (error.response?.data?.message || 'Une erreur est survenue')
        );
    }
  };

  const handleAssignDebiteurs = async () => {
    if (!selectedEmployee || selectedDebiteurs.length === 0) {
      setImportMessage('Veuillez sélectionner un employé et au moins un débiteur');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/debiteurs/assign', {
        debiteur_cins: selectedDebiteurs,
        employee_id: selectedEmployee,
        notes: assignmentNotes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setImportMessage(`Attribution réussie ! ${response.data.count} débiteurs assignés.`);
      setSelectedDebiteurs([]);
      setSelectedEmployee(null);
      setAssignmentNotes('');
      
      await refreshData();
      
    } catch (error) {
      console.error('Erreur lors de l\'attribution:', error);
      setImportMessage(
        'Erreur lors de l\'attribution : ' + 
        (error.response?.data?.message || 'Une erreur est survenue')
      );
    }
  };

  const refreshData = async () => {
    await Promise.all([
      fetchDebiteurs(),
      fetchEmployees()
    ]);
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    await fetchDebiteurs();
  };

  // Fonction de filtrage des débiteurs
  const filteredDebiteurs = debiteurs.filter(debiteur => 
    debiteur.cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (debiteur.nom && debiteur.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (debiteur.prenom && debiteur.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDebiteurs = filteredDebiteurs.slice(indexOfFirstItem, indexOfLastItem);

  // Fonction pour ouvrir le formulaire d'édition
  const handleEditDebiteur = (debiteur) => {
    setEditingDebiteur(debiteur);
    setEditForm({
      nom: debiteur.nom,
      prenom: debiteur.prenom,
      telephone: debiteur.telephone || '',
      adresse: debiteur.adresse || '',
      montant_credit: debiteur.montant_credit || 0
    });
    setEditModalOpen(true);
  };

  // Fonction pour soumettre le formulaire d'édition
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/debiteurs/${editingDebiteur.cin}`, editForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Mettre à jour la liste des débiteurs
      setDebiteurs(debiteurs.map(d => 
        d.cin === editingDebiteur.cin ? { ...d, ...editForm } : d
      ));

      setEditModalOpen(false);
      setEditingDebiteur(null);
      alert('Débiteur mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du débiteur');
    }
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployeeDetails(employee);
    setShowEmployeeModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };
  //cree moi function pour faire search dans debuter par cin, debiteurs.nom, debiteurs.prenom, debiteurs.telephone
  const handleSearchDebiteurs = (value) => {
    setSearchTerm(value);
  };


  // Fonction pour rendre la vue active
  const renderActiveView = () => {
    switch(activeView) {
      case 'users':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Form Card */}
            <div className="lg:col-span-1">
              <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {editingUserId ? 'Edit User' : 'Create New User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-dark-700 bg-dark-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-dark-700 bg-dark-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter email address"
                    />
                  </div>
                  {!editingUserId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-dark-700 bg-dark-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter password"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-dark-700 bg-dark-900/50 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    {editingUserId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-dark-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg hover:from-brand-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-500/25"
                    >
                      {editingUserId ? 'Update User' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Users List Card */}
            <div className="lg:col-span-2">
              <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Users List</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-dark-700">
                          <th className="pb-3 text-gray-400 font-medium">Name</th>
                          <th className="pb-3 text-gray-400 font-medium">Email</th>
                          <th className="pb-3 text-gray-400 font-medium">Role</th>
                          <th className="pb-3 text-gray-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {users.map((user) => (
                          <tr 
                            key={user.id} 
                            className="text-gray-300 hover:bg-dark-700/50 transition-all duration-300 transform hover:scale-[1.01]"
                          >
                            <td className="py-4">{user.name}</td>
                            <td className="py-4">{user.email}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-110 ${
                                user.role === 'admin' ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400' :
                                user.role === 'manager' ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400' :
                                user.role === 'employee' ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400' :
                                'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'debiteurs':
        return (
          <>
            {/* Section d'import Excel */}
            <div className="mb-8 bg-dark-800 rounded-xl border border-dark-700 p-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent mb-4">
                  Import et Attribution Automatique des Débiteurs
              </h2>
              
              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                      Sélectionner les employés pour l'attribution
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    
                      

                      {
                        //triee par le nombre de débiteurs
                        employees.sort((a, b) => b.debiteurs?.length - a.debiteurs?.length).map(employee => (
                            
                            

                          <div 
                              title={`${employee.name} - ${employee.departement}`}
                              aria-label={`${employee.name} - ${employee.departement}`}
                              role="button"
                              tabIndex={0}
                              key={employee.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                                  selectedEmployeesForImport.includes(employee.id)
                                      ? 'border-brand-500 bg-brand-500/10'
                                      //si 
                                      : 'border-dark-600 hover:border-brand-500/50'
                              }`}
                              onClick={() => {
                                  setSelectedEmployeesForImport(prev => 
                                      prev.includes(employee.id)
                                          ? prev.filter(id => id !== employee.id)
                                          : [...prev, employee.id]
                                  );
                              }}
                          >
                              <div className="flex items-center space-x-2">
                                  <input
                                      type="checkbox"
                                      checked={selectedEmployeesForImport.includes(employee.id)}
                                      onChange={() => {}} // Géré par le onClick du parent
                                      className="rounded border-dark-600 text-brand-500 focus:ring-brand-500"
                                  />
                                  <div>
                                      <p className="text-white font-medium">{employee.name}</p>
                                      <p className="text-sm text-gray-400">{employee.matricule}</p>
                                      <p className="text-sm text-gray-400">{employee.email}</p>
                                      <p className="text-sm text-gray-400">{employee.telephone}</p>
                                      <p className="text-sm text-gray-400">{employee.poste}</p>
                                      <p className="text-sm text-red-400"
                                      //si le nombre de débiteurs est supérieur à 28, alors on affiche le nombre de débiteurs en rouge
                                      //sinon on affiche le nombre de débiteurs en vert
                                      style={{ color: employee.debiteurs?.length > 28 ? 'red' : 'green' }}
                                       >{employee.debiteurs?.length || 0 } débiteur(s)</p>
                                      
                                      
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="flex items-center space-x-4">
                  <label className="relative cursor-pointer bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <span>Choisir un fichier CSV</span>
                      <input
                          type="file"
                          className="hidden"
                          accept=".csv"
                          onChange={handleFileImport}
                      />
                  </label>
                  {selectedEmployeesForImport.length > 0 && (
                      <span className="text-gray-400">
                          {selectedEmployeesForImport.length} employé(s) sélectionné(s)
                      </span>
                  )}
                  {importMessage && (
                      <span className={`text-sm ${
                          importMessage.includes('réussi') ? 'text-green-500' : 'text-red-500'
                      }`}>
                          {importMessage}
                      </span>
                  )}
              </div>
            </div>

            {/* Table des débiteurs */}
            <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Liste des Débiteurs</h2>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        // onChange={handleSearchDebiteurs}

                        onChange={(e) => setSearchTerm(e.target.value)}
                        //cree moi function pour faire search avec debiteurs.cin, debiteurs.nom, debiteurs.prenom, debiteurs.telephone
                        // onChange={(e) => setSearchTerm(e.target.value)}
                        //cree moi function pour faire search dans debuter par cin, debiteurs.nom, debiteurs.prenom, debiteurs.telephone
                        // onChange={(e) => setSearchTerm(e.target.value)}


                        className="px-4 py-2 pl-10 rounded-lg bg-dark-900 text-white border border-dark-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      />
                      <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <span className="text-gray-400">
                      {selectedDebiteurs.length} sélectionné(s)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-dark-700">
                    <thead className="bg-dark-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">CIN</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Prénom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Téléphone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Adresse</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Montant Crédit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-dark-900 divide-y divide-dark-800">
                      {debiteurs.map((debiteur) => (
                        <tr 
                          key={debiteur.cin}
                          className="hover:bg-dark-800/50 transition-colors cursor-pointer"
                          onClick={() => handleEditDebiteur(debiteur)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{debiteur.cin}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{debiteur.nom}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{debiteur.prenom}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{debiteur.telephone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{debiteur.adresse}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {parseFloat(debiteur.montant_credit).toLocaleString()} DH
                            {debiteur.montant_credit >= 5000 && <span className="text-yellow-500 ml-2">*</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDebiteur(debiteur);
                              }}
                              className="text-blue-500 hover:text-blue-600 mr-2"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section d'attribution */}
            <div className="mt-6 bg-dark-800 rounded-xl border border-dark-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Attribution des débiteurs</h3>
                <span className="text-sm text-gray-400">
                  {selectedDebiteurs.length} débiteur(s) sélectionné(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Employé assigné
                  </label>
                  <select
                    value={selectedEmployee || ''}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="">Sélectionner un employé</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.matricule}) - {emp.departement}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Notes d'attribution
                  </label>
                  <textarea
                    value={assignmentNotes}
                    onChange={(e) => setAssignmentNotes(e.target.value)}
                    placeholder="Ajouter des notes ou instructions..."
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    rows="3"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleAssignDebiteurs}
                  disabled={!selectedEmployee || selectedDebiteurs.length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg hover:from-brand-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-brand-500/25 flex items-center space-x-2"
                >
                  <i className="fas fa-user-plus"></i>
                  <span>Attribuer {selectedDebiteurs.length} débiteur(s)</span>
                </button>
              </div>
            </div>
          </>
        );

      case 'employees':
        return (
          <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
                  Liste des Employés
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher un employé..."
                      className="px-4 py-2 pl-10 rounded-lg bg-dark-900 text-white border border-dark-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                  <span className="text-gray-400">
                    {employees.length} employé(s)
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-dark-700">
                      <th className="pb-3 text-gray-400 font-medium">Matricule</th>
                      <th className="pb-3 text-gray-400 font-medium">Nom</th>
                      <th className="pb-3 text-gray-400 font-medium">Email</th>
                      <th className="pb-3 text-gray-400 font-medium">Département</th>
                      <th className="pb-3 text-gray-400 font-medium">Poste</th>
                      <th className="pb-3 text-gray-400 font-medium">Date d'embauche</th>
                      <th className="pb-3 text-gray-400 font-medium">Débiteurs assignés</th>
                      <th className="pb-3 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {employees.map((employee) => (
                      <tr 
                        key={employee.id}
                        onClick={() => handleEmployeeClick(employee)}
                        className="hover:bg-dark-700/50 transition-colors cursor-pointer"
                      >
                        <td className="py-4">
                          <span className="font-mono bg-dark-700 px-2 py-1 rounded text-brand-500">
                            {employee.matricule}
                          </span>
                        </td>
                        <td className="py-4 font-medium">{employee.name}</td>
                        <td className="py-4">
                          <a href={`mailto:${employee.email}`} className="text-brand-500 hover:text-brand-400">
                            {employee.email}
                          </a>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                            {employee.departement || 'Non assigné'}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                            {employee.poste || 'Non défini'}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-gray-400">
                            {new Date(employee.date_embauche).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                              {employee.debiteurs?.length || 0} débiteur(s)
                            </span>
                            {employee.debiteurs?.length > 0 && (
                              <button 
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Voir les détails"
                              >
                                <i className="fas fa-info-circle"></i>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                           
                            <button
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditEmployeeForm({
      matricule: employee.matricule || '',
      name: employee.name || '',
      email: employee.email || '',
      departement: employee.departement || '',
      poste: employee.poste || '',
      date_embauche: employee.date_embauche || '',
      salaire: employee.salaire || '',
      telephone: employee.telephone || '',
      adresse: employee.adresse || ''
    });
    setEditEmployeeModalOpen(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/employees/${editingEmployee.id}`, editEmployeeForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Mettre à jour la liste des employés
      setEmployees(employees.map(emp => 
        emp.id === editingEmployee.id ? response.data.employee : emp
      ));

      setEditEmployeeModalOpen(false);
      setEditingEmployee(null);
      alert('Employé mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de l\'employé');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-brand-500/20 to-purple-500/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-blue-500/20 to-cyan-500/20 blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Sidebar with glassmorphism */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-dark-800/50 backdrop-blur-xl border-r border-dark-700 transition-all duration-300 relative z-20`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-brand-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              {sidebarOpen && (
                <span className="text-xl font-display font-bold text-white animate-fadeIn">
                  Admin
                </span>
              )}
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700/50 hover:bg-dark-600/50 text-gray-400 hover:text-white transition-all duration-300"
            >
              <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'} transform transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`}></i>
            </button>
          </div>
        </div>

        <nav className="mt-8">
          <div className="px-3 space-y-1">
            {[
              { icon: 'users-cog', label: 'Utilisateurs', view: 'users' },
              { icon: 'file-invoice-dollar', label: 'Débiteurs', view: 'debiteurs' },
              { icon: 'user-tie', label: 'Employés', view: 'employees' }
            ].map(item => (
              <button 
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`
                  flex items-center w-full px-4 py-3 rounded-lg group transition-all duration-300
                  ${activeView === item.view 
                    ? 'bg-gradient-to-r from-brand-500/20 to-purple-500/20 text-white' 
                    : 'text-gray-400 hover:bg-dark-700/50 hover:text-white'
                  }
                `}
              >
                <AnimatedIcon icon={`fa-${item.icon}`} />
                {sidebarOpen && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
                {activeView === item.view && (
                  <div className="absolute right-0 w-1 h-8 bg-gradient-to-b from-brand-500 to-purple-500 rounded-l-full transform scale-y-100 transition-transform duration-300"></div>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with glassmorphism */}
        <header className="bg-dark-800/50 backdrop-blur-xl border-b border-dark-700 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-brand-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {activeView === 'users' && 'Gestion des Utilisateurs'}
                  {activeView === 'debiteurs' && 'Gestion des Débiteurs'}
                  {activeView === 'employees' && 'Gestion des Employés'}
                </span>
              </h1>

              <div className="flex items-center space-x-4">
                <button className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative px-4 py-2 bg-dark-800 rounded-lg group-hover:bg-dark-700 transition-colors">
                    <span className="text-white group-hover:text-brand-400 transition-colors">
                      <i className="fas fa-bell mr-2"></i>
                      <span className="text-sm">Notifications</span>
                    </span>
                  </div>
                </button>

                <button 
                  onClick={handleLogout}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative px-4 py-2 bg-dark-800 rounded-lg group-hover:bg-dark-700 transition-colors">
                    <span className="text-white group-hover:text-red-400 transition-colors">
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      <span className="text-sm">Déconnexion</span>
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Utilisateurs"
              value={users.length}
              icon="fa-users"
              color="brand"
            />
            <StatCard
              title="Total Débiteurs"
              value={debiteurs.length}
              icon="fa-file-invoice-dollar"
              color="purple"
            />
            <StatCard
              title="Total Employés"
              value={employees.length}
              icon="fa-user-tie"
              color="blue"
            />
            <StatCard
              title="Montant Total"
              value={`${debiteurs.reduce((acc, deb) => acc + parseFloat(deb.montant_credit || 0), 0).toLocaleString()} DH`}
              icon="fa-money-bill-wave"
              color="green"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Keep the modals outside the switch/case */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">
              Modifier le débiteur
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  value={editForm.nom}
                  onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  value={editForm.prenom}
                  onChange={(e) => setEditForm({ ...editForm, prenom: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={editForm.telephone}
                  onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Adresse
                </label>
                <textarea
                  value={editForm.adresse}
                  onChange={(e) => setEditForm({ ...editForm, adresse: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Montant Crédit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.montant_credit}
                  onChange={(e) => setEditForm({ ...editForm, montant_credit: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEmployeeModal && selectedEmployeeDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowEmployeeModal(false)}
          ></div>
          
          {/* Modal */}
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-dark-800 rounded-xl border border-dark-700 shadow-xl max-w-4xl w-full m-auto">
              {/* En-tête du modal */}
              <div className="flex items-center justify-between p-6 border-b border-dark-700">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                    {selectedEmployeeDetails.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedEmployeeDetails.name}</h3>
                    <p className="text-gray-400">#{selectedEmployeeDetails.matricule}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEmployeeModal(false)}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-gray-400 hover:text-white"></i>
                </button>
              </div>

              {/* Corps du modal */}
              <div className="p-6 space-y-6">
                {/* Informations de l'employé */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Informations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-envelope text-gray-400 w-5"></i>
                        <span className="text-white">{selectedEmployeeDetails.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-phone text-gray-400 w-5"></i>
                        <span className="text-white">{selectedEmployeeDetails.telephone || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-building text-gray-400 w-5"></i>
                        <span className="text-white">{selectedEmployeeDetails.departement || 'Non assigné'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Statistiques</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Dossiers assignés</span>
                        <span className="text-white font-medium">{selectedEmployeeDetails.debiteurs?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Taux de résolution</span>
                        <span className="text-white font-medium">
                          {Math.round(Math.random() * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liste des débiteurs */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Débiteurs assignés</h4>
                  <div className="overflow-hidden rounded-lg border border-dark-700">
                    <table className="min-w-full divide-y divide-dark-700">
                      <thead className="bg-dark-900/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">CIN</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prénom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-dark-800 divide-y divide-dark-700">
                        {selectedEmployeeDetails.debiteurs?.map((debiteur) => (
                          <tr key={debiteur.cin} className="hover:bg-dark-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{debiteur.cin}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{debiteur.nom}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{debiteur.prenom}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                debiteur.status === 'resolved' 
                                  ? 'bg-green-500/10 text-green-400'
                                  : 'bg-yellow-500/10 text-yellow-400'
                              }`}>
                                {debiteur.status || 'En cours'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {(!selectedEmployeeDetails.debiteurs || selectedEmployeeDetails.debiteurs.length === 0) && (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                              Aucun débiteur assigné
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Pied du modal */}
              {/* <div className="flex items-center justify-end space-x-3 p-6 border-t border-dark-700">
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 border border-dark-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg hover:from-brand-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                  Gérer les assignations
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition d'employé */}
      {editEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              Modifier l'employé
            </h2>
            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Matricule
                  </label>
                  <input
                    type="text"
                    value={editEmployeeForm.matricule}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, matricule: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={editEmployeeForm.name}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmployeeForm.email}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Département
                  </label>
                  <input
                    type="text"
                    value={editEmployeeForm.departement}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, departement: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Poste
                  </label>
                  <input
                    type="text"
                    value={editEmployeeForm.poste}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, poste: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Date d'embauche
                  </label>
                  <input
                    type="date"
                    value={editEmployeeForm.date_embauche}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, date_embauche: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Salaire
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editEmployeeForm.salaire}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, salaire: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={editEmployeeForm.telephone}
                    onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, telephone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Adresse
                </label>
                <textarea
                  value={editEmployeeForm.adresse}
                  onChange={(e) => setEditEmployeeForm({ ...editEmployeeForm, adresse: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-dark-900 text-white border border-dark-600"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin; 