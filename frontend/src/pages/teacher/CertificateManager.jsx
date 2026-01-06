import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../../App'; // Assuming serverUrl is defined here
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

function CertificateManager() {
    const { token } = useSelector(state => state.user);
    const [certificationLink, setCertificationLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCertificationLink();
    }, [token]);

    const fetchCertificationLink = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverUrl}/api/certification/link`, { headers: { Authorization: `Bearer ${token}` } });
            setCertificationLink(response.data.link);
        } catch (error) {
            console.error('Error fetching certification link:', error);
            if (error.response && error.response.status === 404) {
                toast.info('No certification link set yet. Please create one.');
                setCertificationLink(''); // Clear link if not found
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch certification link.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await axios.post(
                `${serverUrl}/api/certification/manage`,
                { link: certificationLink },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error managing certification link:', error);
            toast.error(error.response?.data?.message || 'Failed to save certification link.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader size={50} color={'#000'} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 text-center">Manage Certification Link</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="certificationLink" className="block text-sm font-medium text-gray-700 mb-1">
                            Certification Form/Page Link
                        </label>
                        <input
                            type="url"
                            id="certificationLink"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                            placeholder="e.g., https://forms.gle/RqNdh925UHiokUYG9"
                            value={certificationLink}
                            onChange={(e) => setCertificationLink(e.target.value)}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-md text-sm font-medium hover:bg-gray-700 transition"
                            disabled={submitting}
                        >
                            {submitting ? <ClipLoader size={20} color='white' /> : 'Save Certification Link'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CertificateManager;
