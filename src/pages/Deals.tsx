import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DealDialog } from '@/components/DealDialog';
import { db } from '@/lib/db';
import { format } from 'date-fns';

export function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deals, setDeals] = useState(db.getDeals());

  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuccess = () => {
    setDeals(db.getDeals());
  };

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Deals
          </h1>
          <p className="text-gray-600 mt-2">Track your sales pipeline</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/40">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-1">Total Pipeline Value</div>
            <div className="text-3xl font-bold text-gray-900">
              ${totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/40">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-1">Active Deals</div>
            <div className="text-3xl font-bold text-gray-900">
              {filteredDeals.filter(d => !['Won', 'Lost'].includes(d.stage)).length}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/40">
          <CardContent className="p-6">
            <div className="text-sm text-gray-600 mb-1">Won Deals</div>
            <div className="text-3xl font-bold text-green-600">
              {filteredDeals.filter(d => d.stage === 'Won').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 glass"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeals.map((deal) => {
          const company = db.getCompany(deal.companyId);
          return (
            <Link key={deal.id} to={`/deals/${deal.id}`}>
              <Card className="glass-card glass-hover border-white/40 h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      deal.stage === 'Won' ? 'bg-green-100 text-green-700' :
                      deal.stage === 'Lost' ? 'bg-red-100 text-red-700' :
                      deal.stage === 'Negotiation' ? 'bg-orange-100 text-orange-700' :
                      deal.stage === 'Proposal' ? 'bg-purple-100 text-purple-700' :
                      deal.stage === 'Qualified' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {deal.stage}
                    </div>
                    <div className="text-sm text-gray-500">{deal.owner}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {deal.name}
                  </h3>
                  {company && (
                    <p className="text-sm text-blue-600 mb-3">{company.name}</p>
                  )}
                  <div className="text-3xl font-bold text-gray-900 mb-3">
                    ${deal.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Close Date: {format(deal.closeDate, 'MMM d, yyyy')}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredDeals.length === 0 && (
        <Card className="glass-card border-white/40">
          <CardContent className="p-12 text-center">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first deal'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <DealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
