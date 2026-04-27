import { useState } from 'react'
import { useNavigate } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, User, Phone, Mail, Calendar, Users, Car, Hotel } from 'lucide-react'
import { Link } from 'react-router'

export default function Builder() {
  const navigate = useNavigate()
  const { data: templates } = trpc.template.list.useQuery()
  const { data: vehicles } = trpc.vehicle.list.useQuery()
  const createPackage = trpc.package.create.useMutation({
    onSuccess: (data: { id: number }) => {
      navigate(`/itinerary/${data.id}`)
    },
  })

  const [form, setForm] = useState({
    templateId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    travelDate: '',
    numAdults: 2,
    numChildren: 0,
    hotelCategory: '3-star',
    vehicleId: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.templateId) return
    createPackage.mutate({
      templateId: Number(form.templateId),
      customerName: form.customerName,
      customerPhone: form.customerPhone || undefined,
      customerEmail: form.customerEmail || undefined,
      travelDate: form.travelDate || undefined,
      numAdults: Number(form.numAdults),
      numChildren: Number(form.numChildren),
      hotelCategory: form.hotelCategory,
      vehicleId: form.vehicleId ? Number(form.vehicleId) : undefined,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1B6E15] text-white py-4 px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-white hover:text-green-200">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">Create New Itinerary</h1>
            <p className="text-xs text-green-200">Fill in customer details to generate a personalized package</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1B6E15]">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer Name *</Label>
                  <Input
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      value={form.customerPhone}
                      onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                      placeholder="Phone number"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      value={form.customerEmail}
                      onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                      placeholder="Email address"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Travel Date</Label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="date"
                      value={form.travelDate}
                      onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1B6E15]">
                <Users className="w-5 h-5" />
                Travel Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Adults</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.numAdults}
                    onChange={(e) => setForm({ ...form, numAdults: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Children</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.numChildren}
                    onChange={(e) => setForm({ ...form, numChildren: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1B6E15]">
                <Hotel className="w-5 h-5" />
                Package Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Template *</Label>
                <Select value={form.templateId} onValueChange={(v) => setForm({ ...form, templateId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a tour template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((t: { id?: number; code: string | null; name: string | null; durationDays: number | null; durationNights: number | null }) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.code} - {t.name} ({t.durationDays}D/{t.durationNights}N)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Hotel className="w-4 h-4" />
                    Hotel Category
                  </Label>
                  <Select value={form.hotelCategory} onValueChange={(v) => setForm({ ...form, hotelCategory: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-star">2 Star</SelectItem>
                      <SelectItem value="3-star">3 Star</SelectItem>
                      <SelectItem value="3-star-premium">3 Star Premium</SelectItem>
                      <SelectItem value="4-star-premium">4 Star Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Vehicle
                  </Label>
                  <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles?.map((v: { id?: number; name: string | null; pricePerDay: string | null }) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {v.name} (₹{v.pricePerDay}/day)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link to="/">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#1B6E15] hover:bg-[#145a10] text-white px-8"
              disabled={createPackage.isPending || !form.templateId || !form.customerName}
            >
              <Save className="w-4 h-4 mr-2" />
              {createPackage.isPending ? 'Creating...' : 'Generate Itinerary'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
