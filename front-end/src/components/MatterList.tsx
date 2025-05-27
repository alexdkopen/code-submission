import { useState, useEffect } from 'react';
import { customerService } from '../services/api';
import type { Matter } from '../types';

interface MatterListProps {
  customerId: string;
}

export function MatterList({ customerId }: MatterListProps) {
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatters();
  }, [customerId]);

  const loadMatters = async () => {
    try {
      setLoading(true);
      const response = await customerService.getMatters(customerId);
      setMatters(response.data.matters);
      setError('');
    } catch (err) {
      setError('Failed to load matters');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center py-4">{error}</div>;
  }

  if (matters.length === 0) {
    return <div className="text-center py-4 text-gray-400">No matters found</div>;
  }

  return (
    <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-900">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Created Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {matters.map((matter) => (
            <tr key={matter.id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-left">
                <div className="text-sm font-medium text-indigo-400">
                  {matter.title}
                </div>
              </td>
              <td className="px-6 py-4 text-left">
                <div className="text-sm text-gray-200 max-w-md truncate">
                  {matter.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  matter.status === 'OPEN' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
                }`}>
                  {matter.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-left">
                {new Date(matter.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 