import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Users, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof db.search>>({
    companies: [],
    contacts: [],
    deals: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const searchResults = db.search(query);
      setResults(searchResults);
    } else {
      setResults({ companies: [], contacts: [], deals: [] });
    }
  }, [query]);

  const handleSelect = (type: 'companies' | 'contacts' | 'deals', id: string) => {
    navigate(`/${type}/${id}`);
    onOpenChange(false);
    setQuery('');
  };

  const totalResults = results.companies.length + results.contacts.length + results.deals.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search CRM</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search companies, contacts, deals..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 glass"
              autoFocus
            />
          </div>

          {query.trim() && (
            <div className="max-h-96 overflow-y-auto space-y-4">
              {totalResults === 0 ? (
                <p className="text-center text-gray-500 py-8">No results found</p>
              ) : (
                <>
                  {results.companies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Companies ({results.companies.length})
                      </h3>
                      <div className="space-y-1">
                        {results.companies.map((company) => (
                          <button
                            key={company.id}
                            onClick={() => handleSelect('companies', company.id)}
                            className="w-full text-left px-4 py-3 rounded-lg glass-hover"
                          >
                            <div className="font-medium">{company.name}</div>
                            <div className="text-sm text-gray-600">{company.industry}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.contacts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Contacts ({results.contacts.length})
                      </h3>
                      <div className="space-y-1">
                        {results.contacts.map((contact) => (
                          <button
                            key={contact.id}
                            onClick={() => handleSelect('contacts', contact.id)}
                            className="w-full text-left px-4 py-3 rounded-lg glass-hover"
                          >
                            <div className="font-medium">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{contact.email}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.deals.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Deals ({results.deals.length})
                      </h3>
                      <div className="space-y-1">
                        {results.deals.map((deal) => (
                          <button
                            key={deal.id}
                            onClick={() => handleSelect('deals', deal.id)}
                            className="w-full text-left px-4 py-3 rounded-lg glass-hover"
                          >
                            <div className="font-medium">{deal.name}</div>
                            <div className="text-sm text-gray-600">
                              ${deal.amount.toLocaleString()} • {deal.stage}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
