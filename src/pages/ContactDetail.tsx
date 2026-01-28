import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Edit, Trash2, Plus, DollarSign, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactDialog } from '@/components/ContactDialog';
import { DealDialog } from '@/components/DealDialog';
import { ActivityDialog } from '@/components/ActivityDialog';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState(db.getContact(id!));
  const [editOpen, setEditOpen] = useState(false);
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  if (!contact) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact not found</h2>
        <Button onClick={() => navigate('/contacts')} variant="outline" className="glass">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contacts
        </Button>
      </div>
    );
  }

  const company = db.getCompany(contact.companyId);
  const activities = db.getActivitiesByRelated('Contact', contact.id);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      db.deleteContact(contact.id);
      toast.success('Contact deleted successfully');
      navigate('/contacts');
    }
  };

  const handleSuccess = () => {
    setContact(db.getContact(id!));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/contacts')}
          className="glass-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-gray-600">{contact.title}</p>
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

      <Card className="glass-card border-white/40">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Email</div>
              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                {contact.email}
              </a>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Phone</div>
              <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                {contact.phone}
              </a>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Company</div>
              {company ? (
                <Link to={`/companies/${company.id}`} className="text-blue-600 hover:underline">
                  {company.name}
                </Link>
              ) : (
                <span className="text-gray-900">-</span>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Owner</div>
              <div className="font-medium">{contact.owner}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Created</div>
              <div className="font-medium">{format(contact.createdAt, 'MMM d, yyyy')}</div>
            </div>
            {contact.tags.length > 0 && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Tags</div>
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="activity">
            <MessageSquare className="w-4 h-4 mr-2" />
            Activity ({activities.length})
          </TabsTrigger>
        </TabsList>

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

      <ContactDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        contact={contact}
        onSuccess={handleSuccess}
      />
      <DealDialog
        open={dealDialogOpen}
        onOpenChange={setDealDialogOpen}
        companyId={contact.companyId}
        onSuccess={handleSuccess}
      />
      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        relatedTo={{ type: 'Contact', id: contact.id }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
