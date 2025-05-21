import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

// Composant StatusBadge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    en_cours: {
      color: 'bg-yellow-500/10 text-yellow-400',
      label: 'En cours'
    },
    termine: {
      color: 'bg-green-500/10 text-green-400',
      label: 'Terminé'
    },
    annule: {
      color: 'bg-red-500/10 text-red-400',
      label: 'Annulé'
    }
  };

  const config = statusConfig[status] || statusConfig.en_cours;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Composant StatCard
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    brand: 'from-brand-500 to-purple-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-yellow-500 to-orange-500'
  };

  return (
    <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center">
        <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${colors[color]} flex items-center justify-center`}>
          <i className={`fas ${icon} text-white text-xl`}></i>
        </div>
        <div className="ml-4">
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-white text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [importMessage, setImportMessage] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debiteurs, setDebiteurs] = useState([]);
  const [stats, setStats] = useState({
    totalDebiteurs: 0,
    totalMontant: 0,
    debiteursClotures: 0,
    debiteursPending: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchEmployeeDetails();
  }, []);

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
      console.error('Error fetching employees:', error);
      if (error.response?.status === 401) {
        navigate('/signin');
      }
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const [profileResponse, debiteursResponse] = await Promise.all([
        axios.get('/employee/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }),
        axios.get('/employee/debiteurs', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })
      ]);

      setEmployeeDetails(profileResponse.data);
      
      // Mise à jour pour gérer la nouvelle structure de réponse
      const debiteursList = debiteursResponse.data.debiteurs || [];
      setDebiteurs(debiteursList);
      
      // Calculer les statistiques
      const totalMontant = debiteursList.reduce((acc, deb) => acc + parseFloat(deb.montant_credit || 0), 0);
      const debiteursClotures = debiteursList.filter(deb => deb.statut === 'termine').length;
      
      setStats({
        totalDebiteurs: debiteursList.length,
        totalMontant,
        debiteursClotures,
        debiteursPending: debiteursList.length - debiteursClotures
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token
    localStorage.removeItem('user'); // Supprimer les informations de l'utilisateur
    navigate('/signin'); // Rediriger vers la page de connexion
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation et soumission du formulaire
  };

  const handleEdit = (employee) => {
    setName(employee.name);
    setEmail(employee.email);
    setRole(employee.role);
    setEditingEmployeeId(employee.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('employee');
    setEditingEmployeeId(null);
    setImportMessage('');
  };

  const renderActiveView = () => {
    // Rendre la vue active (liste des employés ou formulaire d'édition)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-red-500 bg-red-500/10 px-4 py-2 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-xl shadow-lg p-6 border border-dark-700">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white mb-4">
                  {employeeDetails?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{employeeDetails?.name}</h2>
                <p className="text-gray-400 mb-4">{employeeDetails?.email}</p>
                <div className="w-full border-t border-dark-700 pt-4 mt-4">
                  <p className="text-gray-400">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    Membre depuis: {new Date(employeeDetails?.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Débiteurs"
              value={stats.totalDebiteurs}
              icon="fa-users"
              color="brand"
            />
            <StatCard
              title="Montant Total"
              value={`${stats.totalMontant.toLocaleString()} DH`}
              icon="fa-money-bill-wave"
              color="green"
            />
            <StatCard
              title="Dossiers Clôturés"
              value={stats.debiteursClotures}
              icon="fa-check-circle"
              color="blue"
            />
            <StatCard
              title="Dossiers en Cours"
              value={stats.debiteursPending}
              icon="fa-clock"
              color="yellow"
            />
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button 
            onClick={handleLogout} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Déconnexion
          </button>
        </div>

        <div className="bg-dark-800 rounded-xl shadow-lg border border-dark-700 overflow-hidden">
          <div className="p-6 border-b border-dark-700">
            <h2 className="text-xl font-bold text-white">Mes Débiteurs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">CIN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prénom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date d'attribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {debiteurs.map((debiteur) => (
                  <tr key={debiteur.cin} className="hover:bg-dark-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{debiteur.cin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{debiteur.nom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{debiteur.prenom}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {parseFloat(debiteur.montant_credit).toLocaleString()} DH
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={debiteur.statut} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(debiteur.date_attribution).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
                {debiteurs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      Aucun débiteur assigné
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee; 