import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, MapPin, Activity } from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const ZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const token = authService.getToken();
      const res = await axios.get('http://localhost:5001/api/v1/production/zones', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setZones(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      await axios.post('http://localhost:5001/api/v1/production/zones', 
        { name: newZoneName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewZoneName('');
      setIsModalOpen(false);
      fetchZones();
    } catch (error) {
      console.error('Error adding zone:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette zone ?')) return;
    try {
      const token = authService.getToken();
      await axios.delete(`http://localhost:5001/api/v1/production/zones/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchZones();
    } catch (error) {
      alert('Erreur : Vérifiez que la zone est vide.');
    }
  };

  const columns = [
    { id: 'name', label: 'Nom de la Zone' },
    { 
      id: 'cultureSites', 
      label: 'Nombre de Sites',
      format: (sites: any[]) => (
        <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">
          {sites?.length || 0} sites
        </span>
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
          <h1 className="text-3xl font-black text-slate-900 font-outfit">Zones Géographiques</h1>
          <p className="text-slate-500">Gérez les grandes divisions territoriales de votre exploitation.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus size={20} /> Nouvelle Zone
        </button>
      </div>

      <DataTable columns={columns} data={zones} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter une Zone Géographique">
        <form onSubmit={handleAddZone} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nom de la Zone (ex: Centre, Littoral)</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold">
            Créer la Zone
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ZonesPage;

