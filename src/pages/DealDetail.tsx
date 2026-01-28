import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Edit, Trash2, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DealDialog } from '@/components/DealDialog';
import { ActivityDialog } from '@/components/ActivityDialog';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(db.getDeal(id!));
  const [editOpen, setEditOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);

  if (!deal) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal not found</h2>
        <Button onClick={() => navigate('/deals')} variant="outline" className="glass">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Deals
        </Button>
      </div>
    );
  }

  const company = db.getCompany(deal.companyId);
  const activities = db.getActivitiesByRelated('Deal', deal.id);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this deal?')) {
      db.deleteDeal(deal.id);
      toast.success('Deal deleted successfully');
      navigate('/deals');
    }
  };

  const handleSuccess = () => {
    setDeal(db.getDeal(id!));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/deals')}
          className="glass-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {deal.name}
          </h1>
          <p className="text-gray-600">${deal.amount.toLocaleString()}</p>
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
              <div className="text-sm text-gray-600 mb-1">Stage</div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                deal.stage === 'Won' ? 'bg-green-100 text-green-700' :
                deal.stage === 'Lost' ? 'bg-red-100 text-red-700' :
                deal.stage === 'Negotiation' ? 'bg-orange-100 text-orange-700' :
                deal.stage === 'Proposal' ? 'bg-purple-100 text-purple-700' :
                deal.stage === 'Qualified' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {deal.stage}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Company</div>
              {company ? (
                <Link to={`/companies/${company.id}`} className="text-blue-600 hover:underline font-medium">
                  {company.name}
                </Link>
              ) : (
                <span className="text-gray-900">-</span>
              )}
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Close Date</div>
              <div className="font-medium">{format(deal.closeDate, 'MMM d, yyyy')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Owner</div>
              <div className="font-medium">{deal.owner}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Created</div>
              <div className="font-medium">{format(deal.createdAt, 'MMM d, yyyy')}</div>
            </div>
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

      <DealDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        deal={deal}
        onSuccess={handleSuccess}
      />
      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        relatedTo={{ type: 'Deal', id: deal.id }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
