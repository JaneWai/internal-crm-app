export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  size: string;
  status: 'Lead' | 'Prospect' | 'Customer';
  owner: string;
  createdAt: Date;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  companyId: string;
  owner: string;
  tags: string[];
  createdAt: Date;
}

export interface Deal {
  id: string;
  name: string;
  companyId: string;
  amount: number;
  stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  closeDate: Date;
  owner: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'Note' | 'Call' | 'Email' | 'Meeting';
  content: string;
  dateTime: Date;
  owner: string;
  relatedTo: {
    type: 'Company' | 'Contact' | 'Deal';
    id: string;
  };
}

class Database {
  private companies: Company[] = [];
  private contacts: Contact[] = [];
  private deals: Deal[] = [];
  private activities: Activity[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    const owners = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim'];
    
    // Seed Companies
    const companyData = [
      { name: 'TechCorp Solutions', industry: 'Technology', website: 'techcorp.com', size: '500-1000', status: 'Customer' as const },
      { name: 'Global Innovations', industry: 'Manufacturing', website: 'globalinno.com', size: '1000-5000', status: 'Prospect' as const },
      { name: 'Digital Dynamics', industry: 'Marketing', website: 'digitaldyn.com', size: '50-200', status: 'Lead' as const },
      { name: 'CloudFirst Inc', industry: 'Technology', website: 'cloudfirst.io', size: '200-500', status: 'Customer' as const },
      { name: 'Retail Masters', industry: 'Retail', website: 'retailmasters.com', size: '5000+', status: 'Prospect' as const },
      { name: 'FinTech Pro', industry: 'Finance', website: 'fintechpro.com', size: '100-200', status: 'Customer' as const },
      { name: 'HealthCare Plus', industry: 'Healthcare', website: 'healthcareplus.com', size: '1000-5000', status: 'Lead' as const },
      { name: 'EduTech Systems', industry: 'Education', website: 'edutech.com', size: '50-200', status: 'Prospect' as const },
      { name: 'Green Energy Co', industry: 'Energy', website: 'greenenergy.com', size: '500-1000', status: 'Customer' as const },
      { name: 'Logistics Hub', industry: 'Logistics', website: 'logisticshub.com', size: '200-500', status: 'Lead' as const },
    ];

    this.companies = companyData.map((data, i) => ({
      id: `comp-${i + 1}`,
      ...data,
      owner: owners[i % owners.length],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    }));

    // Seed Contacts
    const contactData = [
      { firstName: 'John', lastName: 'Smith', email: 'john.smith@techcorp.com', phone: '+1-555-0101', title: 'CEO', companyId: 'comp-1', tags: ['Decision Maker', 'Executive'] },
      { firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@techcorp.com', phone: '+1-555-0102', title: 'CTO', companyId: 'comp-1', tags: ['Technical', 'Executive'] },
      { firstName: 'Robert', lastName: 'Brown', email: 'robert.brown@globalinno.com', phone: '+1-555-0103', title: 'VP Sales', companyId: 'comp-2', tags: ['Sales', 'Manager'] },
      { firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.anderson@globalinno.com', phone: '+1-555-0104', title: 'Marketing Director', companyId: 'comp-2', tags: ['Marketing'] },
      { firstName: 'James', lastName: 'Taylor', email: 'james.taylor@digitaldyn.com', phone: '+1-555-0105', title: 'Founder', companyId: 'comp-3', tags: ['Decision Maker'] },
      { firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@cloudfirst.io', phone: '+1-555-0106', title: 'Product Manager', companyId: 'comp-4', tags: ['Product'] },
      { firstName: 'David', lastName: 'Martinez', email: 'david.martinez@cloudfirst.io', phone: '+1-555-0107', title: 'Engineering Lead', companyId: 'comp-4', tags: ['Technical'] },
      { firstName: 'Jennifer', lastName: 'Lee', email: 'jennifer.lee@retailmasters.com', phone: '+1-555-0108', title: 'COO', companyId: 'comp-5', tags: ['Executive', 'Operations'] },
      { firstName: 'Michael', lastName: 'White', email: 'michael.white@fintechpro.com', phone: '+1-555-0109', title: 'CFO', companyId: 'comp-6', tags: ['Finance', 'Executive'] },
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@fintechpro.com', phone: '+1-555-0110', title: 'Head of Sales', companyId: 'comp-6', tags: ['Sales', 'Manager'] },
      { firstName: 'Christopher', lastName: 'Davis', email: 'chris.davis@healthcareplus.com', phone: '+1-555-0111', title: 'Director', companyId: 'comp-7', tags: ['Decision Maker'] },
      { firstName: 'Amanda', lastName: 'Miller', email: 'amanda.miller@edutech.com', phone: '+1-555-0112', title: 'VP Product', companyId: 'comp-8', tags: ['Product', 'Executive'] },
      { firstName: 'Daniel', lastName: 'Wilson', email: 'daniel.wilson@greenenergy.com', phone: '+1-555-0113', title: 'CEO', companyId: 'comp-9', tags: ['Decision Maker', 'Executive'] },
      { firstName: 'Jessica', lastName: 'Moore', email: 'jessica.moore@greenenergy.com', phone: '+1-555-0114', title: 'VP Operations', companyId: 'comp-9', tags: ['Operations'] },
      { firstName: 'Thomas', lastName: 'Taylor', email: 'thomas.taylor@logisticshub.com', phone: '+1-555-0115', title: 'Founder & CEO', companyId: 'comp-10', tags: ['Decision Maker'] },
      { firstName: 'Ashley', lastName: 'Anderson', email: 'ashley.anderson@logisticshub.com', phone: '+1-555-0116', title: 'Sales Manager', companyId: 'comp-10', tags: ['Sales'] },
      { firstName: 'Matthew', lastName: 'Thomas', email: 'matthew.thomas@retailmasters.com', phone: '+1-555-0117', title: 'IT Director', companyId: 'comp-5', tags: ['Technical'] },
      { firstName: 'Nicole', lastName: 'Jackson', email: 'nicole.jackson@healthcareplus.com', phone: '+1-555-0118', title: 'Procurement Manager', companyId: 'comp-7', tags: ['Procurement'] },
      { firstName: 'Ryan', lastName: 'Harris', email: 'ryan.harris@edutech.com', phone: '+1-555-0119', title: 'CTO', companyId: 'comp-8', tags: ['Technical', 'Executive'] },
      { firstName: 'Lauren', lastName: 'Martin', email: 'lauren.martin@digitaldyn.com', phone: '+1-555-0120', title: 'Marketing Manager', companyId: 'comp-3', tags: ['Marketing'] },
    ];

    this.contacts = contactData.map((data, i) => ({
      id: `cont-${i + 1}`,
      ...data,
      owner: owners[i % owners.length],
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    }));

    // Seed Deals
    const dealData = [
      { name: 'Enterprise License Renewal', companyId: 'comp-1', amount: 150000, stage: 'Negotiation' as const, closeDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { name: 'Cloud Migration Project', companyId: 'comp-2', amount: 250000, stage: 'Proposal' as const, closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { name: 'Marketing Automation Setup', companyId: 'comp-3', amount: 45000, stage: 'Qualified' as const, closeDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) },
      { name: 'Platform Upgrade', companyId: 'comp-4', amount: 85000, stage: 'Won' as const, closeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { name: 'Retail POS System', companyId: 'comp-5', amount: 320000, stage: 'Proposal' as const, closeDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      { name: 'Security Audit & Compliance', companyId: 'comp-6', amount: 75000, stage: 'Won' as const, closeDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { name: 'Patient Management System', companyId: 'comp-7', amount: 180000, stage: 'New' as const, closeDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { name: 'Learning Platform Integration', companyId: 'comp-8', amount: 95000, stage: 'Qualified' as const, closeDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000) },
      { name: 'IoT Monitoring Solution', companyId: 'comp-9', amount: 210000, stage: 'Negotiation' as const, closeDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) },
      { name: 'Fleet Management Software', companyId: 'comp-10', amount: 135000, stage: 'New' as const, closeDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000) },
    ];

    this.deals = dealData.map((data, i) => ({
      id: `deal-${i + 1}`,
      ...data,
      owner: owners[i % owners.length],
      createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
    }));

    // Seed Activities
    const activityTypes: Activity['type'][] = ['Note', 'Call', 'Email', 'Meeting'];
    const activityContents = [
      'Initial discovery call completed. Client interested in our enterprise solution.',
      'Sent proposal document with pricing breakdown and implementation timeline.',
      'Follow-up meeting scheduled for next week to discuss technical requirements.',
      'Client requested additional references from similar industry clients.',
      'Demo session conducted successfully. Positive feedback received.',
      'Contract negotiations in progress. Discussing payment terms.',
      'Quarterly business review completed. Discussed expansion opportunities.',
      'Technical requirements gathering session. Identified key integration points.',
      'Pricing discussion. Client requested volume discount.',
      'Implementation kickoff meeting scheduled for next month.',
    ];

    const relatedTypes: Array<'Company' | 'Contact' | 'Deal'> = ['Company', 'Contact', 'Deal'];
    
    for (let i = 0; i < 30; i++) {
      const relatedType = relatedTypes[i % 3];
      let relatedId = '';
      
      if (relatedType === 'Company') {
        relatedId = `comp-${(i % 10) + 1}`;
      } else if (relatedType === 'Contact') {
        relatedId = `cont-${(i % 20) + 1}`;
      } else {
        relatedId = `deal-${(i % 10) + 1}`;
      }

      this.activities.push({
        id: `act-${i + 1}`,
        type: activityTypes[i % 4],
        content: activityContents[i % 10],
        dateTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        owner: owners[i % owners.length],
        relatedTo: {
          type: relatedType,
          id: relatedId,
        },
      });
    }
  }

  // Companies
  getCompanies(): Company[] {
    return [...this.companies].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getCompany(id: string): Company | undefined {
    return this.companies.find(c => c.id === id);
  }

  addCompany(company: Omit<Company, 'id' | 'createdAt'>): Company {
    const newCompany: Company = {
      ...company,
      id: `comp-${this.companies.length + 1}`,
      createdAt: new Date(),
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  updateCompany(id: string, updates: Partial<Company>): Company | undefined {
    const index = this.companies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.companies[index] = { ...this.companies[index], ...updates };
      return this.companies[index];
    }
    return undefined;
  }

  deleteCompany(id: string): boolean {
    const index = this.companies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.companies.splice(index, 1);
      return true;
    }
    return false;
  }

  // Contacts
  getContacts(): Contact[] {
    return [...this.contacts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getContact(id: string): Contact | undefined {
    return this.contacts.find(c => c.id === id);
  }

  getContactsByCompany(companyId: string): Contact[] {
    return this.contacts.filter(c => c.companyId === companyId);
  }

  addContact(contact: Omit<Contact, 'id' | 'createdAt'>): Contact {
    const newContact: Contact = {
      ...contact,
      id: `cont-${this.contacts.length + 1}`,
      createdAt: new Date(),
    };
    this.contacts.push(newContact);
    return newContact;
  }

  updateContact(id: string, updates: Partial<Contact>): Contact | undefined {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contacts[index] = { ...this.contacts[index], ...updates };
      return this.contacts[index];
    }
    return undefined;
  }

  deleteContact(id: string): boolean {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      return true;
    }
    return false;
  }

  // Deals
  getDeals(): Deal[] {
    return [...this.deals].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getDeal(id: string): Deal | undefined {
    return this.deals.find(d => d.id === id);
  }

  getDealsByCompany(companyId: string): Deal[] {
    return this.deals.filter(d => d.companyId === companyId);
  }

  addDeal(deal: Omit<Deal, 'id' | 'createdAt'>): Deal {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${this.deals.length + 1}`,
      createdAt: new Date(),
    };
    this.deals.push(newDeal);
    return newDeal;
  }

  updateDeal(id: string, updates: Partial<Deal>): Deal | undefined {
    const index = this.deals.findIndex(d => d.id === id);
    if (index !== -1) {
      this.deals[index] = { ...this.deals[index], ...updates };
      return this.deals[index];
    }
    return undefined;
  }

  deleteDeal(id: string): boolean {
    const index = this.deals.findIndex(d => d.id === id);
    if (index !== -1) {
      this.deals.splice(index, 1);
      return true;
    }
    return false;
  }

  // Activities
  getActivities(): Activity[] {
    return [...this.activities].sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  }

  getActivitiesByRelated(type: 'Company' | 'Contact' | 'Deal', id: string): Activity[] {
    return this.activities
      .filter(a => a.relatedTo.type === type && a.relatedTo.id === id)
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  }

  addActivity(activity: Omit<Activity, 'id'>): Activity {
    const newActivity: Activity = {
      ...activity,
      id: `act-${this.activities.length + 1}`,
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  // Search
  search(query: string): { companies: Company[]; contacts: Contact[]; deals: Deal[] } {
    const lowerQuery = query.toLowerCase();
    
    return {
      companies: this.companies.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) ||
        c.industry.toLowerCase().includes(lowerQuery)
      ),
      contacts: this.contacts.filter(c => 
        c.firstName.toLowerCase().includes(lowerQuery) ||
        c.lastName.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery)
      ),
      deals: this.deals.filter(d => 
        d.name.toLowerCase().includes(lowerQuery)
      ),
    };
  }
}

export const db = new Database();
