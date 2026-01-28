import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';

export function Dashboard() {
  const companies = db.getCompanies();
  const contacts = db.getContacts();
  const deals = db.getDeals();

  const dealsByStage = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDealValue = deals.reduce((sum, deal) => sum + deal.amount, 0);
  const wonDeals = deals.filter(d => d.stage === 'Won');
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);

  const stats = [
    {
      title: 'Total Companies',
      value: companies.length,
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      link: '/companies',
    },
    {
      title: 'Total Contacts',
      value: contacts.length,
      icon: Users,
      color: 'from-cyan-500 to-cyan-600',
      link: '/contacts',
    },
    {
      title: 'Active Deals',
      value: deals.length,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      link: '/deals',
    },
    {
      title: 'Total Deal Value',
      value: `$${(totalDealValue / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      link: '/deals',
    },
  ];

  const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const stageColors: Record<string, string> = {
    New: 'bg-blue-500',
    Qualified: 'bg-cyan-500',
    Proposal: 'bg-yellow-500',
    Negotiation: 'bg-orange-500',
    Won: 'bg-green-500',
    Lost: 'bg-red-500',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">Welcome back! Here's your CRM overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="glass-card glass-hover cursor-pointer border-white/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Deals by Stage */}
      <Card className="glass-card border-white/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Deals by Stage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages.map((stage) => {
              const count = dealsByStage[stage] || 0;
              const percentage = deals.length > 0 ? (count / deals.length) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{stage}</span>
                    <span className="text-sm text-gray-600">{count} deals</span>
                  </div>
                  <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stageColors[stage]} transition-all duration-500 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-white/30">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Won Deals</div>
                <div className="text-2xl font-bold text-green-600">{wonDeals.length}</div>
                <div className="text-xs text-gray-500 mt-1">
                  ${(wonValue / 1000).toFixed(0)}K total value
                </div>
              </div>
              <div className="glass p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {deals.length > 0 ? ((wonDeals.length / deals.length) * 100).toFixed(0) : 0}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  of all deals
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="glass-card border-white/40">
        <CardHeader>
          <CardTitle>Recent Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companies.slice(0, 5).map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="flex items-center justify-between p-4 glass-hover rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{company.name}</div>
                    <div className="text-sm text-gray-600">{company.industry}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    company.status === 'Customer' ? 'bg-green-100 text-green-700' :
                    company.status === 'Prospect' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {company.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
