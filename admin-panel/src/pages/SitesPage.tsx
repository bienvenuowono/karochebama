import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Layers, Activity } from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const SitesPage = () => {
  const [sites, setSites] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    geographicZoneId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [sRes, zRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/production/sites', config),
        axios.get('http://localhost:5000/api/v1/production/zones', config)
      ]);
      setSites(sRes.data.data);
      setZones(zRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      await axios.post('http://localhost:5000/api/v1/production/sites', 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ name: '', geographicZoneId: '' });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error adding site:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce site ?')) return;
    try {
      const token = authService.getToken();
      await axios.delete(`http://localhost:5000/api/v1/production/sites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert('Erreur : Vérifiez que le site ne contient pas de cultures.');
    }
  };

  const columns = [
    { id: 'name', label: 'Nom du Site' },
    { 
      id: 'geographicZone', 
      label: 'Zone Géographique',
      format: (zone: any) => (
        <div className="flex items-center gap-2">
           <Layers size={14} className="text-primary-500" />
           <span className="text-xs font-bold text-slate-700">{zone?.name || 'N/A'}</span>
        </div>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      format: (_: any, row: any) => (
        <button onClick={() => handleDelete(row.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
          <Trash2 size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit">Sites de Culture</h1>
          <p className="text-slate-500">Gérez les lieux physiques où sont plantées vos cultures.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus size={20} /> Nouveau Site
        </button>
      </div>

      <DataTable columns={columns} data={sites} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouveau Site de Culture">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom du Site (ex: Ferme de Mbankomo)</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Zone Géographique</label>
            <select 
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={formData.geographicZoneId}
              onChange={(e) => setFormData({...formData, geographicZoneId: e.target.value})}
            >
              <option value="">Choisir une zone...</option>
              {zones.map((z: any) => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold shadow-lg shadow-primary-500/25">
            Enregistrer le Site
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default SitesPage;
