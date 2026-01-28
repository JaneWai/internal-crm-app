import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Edit, Trash2, Plus, Users, DollarSign, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyDialog } from '@/components/CompanyDialog';
import { ContactDialog } from '@/components/ContactDialog';
import { DealDialog } from '@/components/DealDialog';
import { ActivityDialog } from '@/components/ActivityDialog';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState(db.getCompany(id!));
  const [editOpen, setEditOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company not found</h2>
        <Button onClick={() => navigate('/companies')} variant="outline" className="glass">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Companies
        </Button>
      </div>
    );
  }

  const contacts = db.getContactsByCompany(company.id);
  const deals = db.getDealsByCompany(company.id);
  const activities = db.getActivitiesByRelated('Company', company.id);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this company?')) {
      db.deleteCompany(company.id);
      toast.success('Company deleted successfully');
      navigate('/companies');
    }
  };

  const handleSuccess = () => {
    setCompany(db.getCompany(id!));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/companies')}
          className="glass-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {company.name}
          </h1>
          <p className="text-gray-600">{company.industry}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditOpen(true)}
            className="glass-hover"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="glass-hover text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Company Info */}
      <Card className="glass-card border-white/40">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                company.status === 'Customer' ? 'bg-green-100 text-green-700' :
                company.status === 'Prospect' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {company.status}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Website</div>
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Company Size</div>
              <div className="font-medium">{company.size} employees</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Owner</div>
              <div className="font-medium">{company.owner}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Created</div>
              <div className="font-medium">{format(company.createdAt, 'MMM d, yyyy')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="contacts">
            <Users className="w-4 h-4 mr-2" />
            Contacts ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="deals">
            <DollarSign className="w-4 h-4 mr-2" />
            Deals ({deals.length})
          </TabsTrigger>
          <TabsTrigger value="activity">
            <MessageSquare className="w-4 h-4 mr-2" />
            Activity ({activities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setContactDialogOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <Link key={contact.id} to={`/contacts/${contact.id}`}>
                <Card className="glass-card glass-hover border-white/40">
                  <CardContent className="p-4">
                    <div className="font-semibold text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </div>
                    <div className="text-sm text-gray-600">{contact.title}</div>
                    <div className="text-sm text-gray-600 mt-2">{contact.email}</div>
                    <div className="text-sm text-gray-600">{contact.phone}</div>
                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {contact.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {contacts.length === 0 && (
            <Card className="glass-card border-white/40">
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No contacts yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setDealDialogOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deals.map((deal) => (
              <Link key={deal.id} to={`/deals/${deal.id}`}>
                <Card className="glass-card glass-hover border-white/40">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-gray-900">{deal.name}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deal.stage === 'Won' ? 'bg-green-100 text-green-700' :
                        deal.stage === 'Lost' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {deal.stage}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ${deal.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Close Date: {format(deal.closeDate, 'MMM d, yyyy')}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {deals.length === 0 && (
            <Card className="glass-card border-white/40">
              <CardContent className="p-12 text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No deals yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setActivityDialogOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="glass-card border-white/40">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'Note' ? 'bg-blue-100' :
                      activity.type === 'Call' ? 'bg-green-100' :
                      activity.type === 'Email' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{activity.type}</span>
                        <span className="text-sm text-gray-500">
                          {format(activity.dateTime, 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-gray-700">{activity.content}</p>
                      <div className="text-sm text-gray-500 mt-1">by {activity.owner}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {activities.length === 0 && (
            <Card className="glass-card border-white/40">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No activity yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <CompanyDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        company={company}
        onSuccess={handleSuccess}
      />
      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        companyId={company.id}
        onSuccess={handleSuccess}
      />
      <DealDialog
        open={dealDialogOpen}
        onOpenChange={setDealDialogOpen}
        companyId={company.id}
        onSuccess={handleSuccess}
      />
      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        relatedTo={{ type: 'Company', id: company.id }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
