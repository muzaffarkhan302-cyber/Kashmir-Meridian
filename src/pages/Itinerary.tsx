import { useState, useRef } from 'react'
import { useParams } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Printer, Save, Check, X, Star, Phone, Mail, MapPin, Banknote } from 'lucide-react'
import { Link } from 'react-router'
import { QRCodeSVG } from 'qrcode.react'

export default function Itinerary() {
  const { id } = useParams<{ id: string }>()
  const pkgId = Number(id)
  const { data: pkg, refetch } = trpc.package.getById.useQuery({ id: pkgId })
  const updatePricing = trpc.package.updatePricing.useMutation({ onSuccess: () => refetch() })

  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [priceForm, setPriceForm] = useState({
    hotelCost: '',
    vehicleCost: '',
    sightseeingCost: '',
    miscCost: '',
    totalCost: '',
    perPersonCost: '',
  })

  const printRef = useRef<HTMLDivElement>(null)

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1B6E15] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading itinerary...</p>
        </div>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const startEditingPrice = () => {
    setPriceForm({
      hotelCost: pkg.hotelCost?.toString() || '',
      vehicleCost: pkg.vehicleCost?.toString() || '',
      sightseeingCost: pkg.sightseeingCost?.toString() || '',
      miscCost: pkg.miscCost?.toString() || '',
      totalCost: pkg.totalCost?.toString() || '',
      perPersonCost: pkg.perPersonCost?.toString() || '',
    })
    setIsEditingPrice(true)
  }

  const savePrice = () => {
    updatePricing.mutate({
      id: pkgId,
      hotelCost: priceForm.hotelCost || undefined,
      vehicleCost: priceForm.vehicleCost || undefined,
      sightseeingCost: priceForm.sightseeingCost || undefined,
      miscCost: priceForm.miscCost || undefined,
      totalCost: priceForm.totalCost || undefined,
      perPersonCost: priceForm.perPersonCost || undefined,
    })
    setIsEditingPrice(false)
  }

  const template = pkg.template
  const days = pkg.days
  const hotels = pkg.hotels || []
  const vehicles = pkg.vehicles || []

  const filteredHotels = hotels.filter((h: { category: string }) => h.category === pkg.hotelCategory)
  const selectedVehicle = vehicles.find((v: { id?: number }) => v.id === pkg.vehicleId)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Floating Action Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-[#1B6E15]">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-sm font-semibold text-gray-800">{pkg.customerName}</p>
              <p className="text-xs text-gray-500">{template?.name} • {template?.durationDays}D/{template?.durationNights}N</p>
            </div>
          </div>
          <Button onClick={handlePrint} variant="outline" size="sm" className="border-[#1B6E15] text-[#1B6E15]">
            <Printer className="w-4 h-4 mr-2" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Main Itinerary Content */}
      <div ref={printRef} className="max-w-5xl mx-auto pt-20 pb-8 px-4 print:pt-0 print:px-0">
        {/* COVER SLIDE */}
        <section className="relative bg-white rounded-2xl overflow-hidden shadow-xl print:shadow-none print:rounded-none mb-8 print:mb-0 print:break-after-page">
          <div className="relative h-[600px] print:h-[100vh]">
            <img
              src={template?.coverImage || '/images/cover-bg.jpg'}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
              <img src="/images/logo.png" alt="Logo" className="w-32 h-32 rounded-full object-cover mb-6 shadow-2xl" />
              <h1 className="text-5xl font-bold tracking-wider mb-2" style={{ fontFamily: 'Cambria, serif' }}>
                KASHMIR MERIDIAN
              </h1>
              <p className="text-lg tracking-[0.3em] text-green-200 mb-8">EXPLORE WITH US • EST. 2009</p>
              <div className="bg-white/20 backdrop-blur-md rounded-lg px-8 py-4 text-center">
                <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'Cambria, serif' }}>{template?.name}</p>
                <p className="text-xl text-green-300">{template?.subtitle}</p>
                <p className="text-lg mt-2">{template?.durationDays} Days / {template?.durationNights} Nights</p>
              </div>
              <div className="absolute bottom-8 text-sm tracking-widest">
                WWW.KASHMRIMERIDIAN.COM
              </div>
            </div>
          </div>
        </section>

        {/* BRIEF ITINERARY */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              BRIEF <span className="text-[#29BD20]">Itinerary</span>
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
          </div>
          <div className="space-y-3">
            {days.map((day: { id?: number; dayNumber: number; title: string; subtitle: string | null }, index: number) => (
              <div
                key={day.id}
                className="flex items-center gap-4 p-4 rounded-lg border-l-4 border-[#1B6E15] bg-gray-50 hover:bg-green-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-[#1B6E15] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {day.dayNumber}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{day.title}</p>
                  {day.subtitle && <p className="text-sm text-[#1B6E15]">{day.subtitle}</p>}
                </div>
                {index < days.length - 1 && (
                  <div className="hidden md:block text-gray-300">→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* DAY-WISE DETAILED SLIDES */}
        {days.map((day: { id: number; packageId: number; dayNumber: number; title: string; subtitle: string | null; description: string; imageUrl: string | null; highlights: unknown; createdAt: Date }) => (
          <section
            key={day.id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page"
          >
            {/* Header */}
            <div className="relative h-24 bg-[#1B6E15] flex items-center px-8">
              <div className="absolute top-0 right-0 w-32 h-full bg-[#145a10] transform skew-x-[-12deg] origin-top-right" />
              <div className="relative z-10 flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                  {day.dayNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cambria, serif' }}>
                    {day.title}
                  </h3>
                  {day.subtitle && (
                    <p className="text-green-200 text-sm">{day.subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {day.imageUrl && (
                <div className="rounded-xl overflow-hidden mb-6 h-64">
                  <img
                    src={day.imageUrl}
                    alt={day.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed text-base" style={{ fontFamily: 'Verdana, sans-serif' }}>
                  {day.description}
                </p>
                {Boolean(day.highlights) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(typeof day.highlights === 'string' ? JSON.parse(day.highlights) : day.highlights as string[]).map(
                      (h: string, i: number) => (
                        <span key={i} className="bg-[#1B6E15] text-white px-3 py-1 rounded-full text-sm font-medium">
                          {h}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* HOTEL DETAILS */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              {pkg.hotelCategory.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Hotel Details
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
          </div>

          {filteredHotels.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredHotels.map((hotel: { id?: number; imageUrl: string | null; name: string | null; location: string | null; description: string | null }) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    {hotel.imageUrl ? (
                      <img src={hotel.imageUrl || ''} alt={hotel.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1B6E15] to-[#29BD20] flex items-center justify-center text-white">
                        <Hotel className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-0.5">
                      {[...Array(getStarCount(pkg.hotelCategory))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg text-gray-800">{hotel.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {hotel.location}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">{hotel.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">No hotels found for {pkg.hotelCategory} category</p>
            </div>
          )}
        </section>

        {/* VEHICLE DETAILS */}
        {selectedVehicle && (
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
                Vehicle Details
              </h2>
              <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
            </div>
            <div className="bg-gray-50 rounded-xl p-6 flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#1B6E15] flex items-center justify-center text-white">
                <Car className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedVehicle.name}</h3>
                <p className="text-gray-600">Type: {selectedVehicle.type} • Capacity: {selectedVehicle.capacity} persons</p>
                <p className="text-[#1B6E15] font-semibold mt-1">₹{selectedVehicle.pricePerDay} per day</p>
              </div>
            </div>
          </section>
        )}

        {/* TOTAL PACKAGE COST - EDITABLE */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              Total Package Cost
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
            <p className="text-gray-500 mt-2">Premium Package • {pkg.numAdults} Adults {pkg.numChildren && pkg.numChildren > 0 ? `+ ${pkg.numChildren} Children` : ''}</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {!isEditingPrice ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Hotel Cost</p>
                    <p className="text-xl font-bold text-gray-800">₹{pkg.hotelCost || '0'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Vehicle Cost</p>
                    <p className="text-xl font-bold text-gray-800">₹{pkg.vehicleCost || '0'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Sightseeing</p>
                    <p className="text-xl font-bold text-gray-800">₹{pkg.sightseeingCost || '0'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Miscellaneous</p>
                    <p className="text-xl font-bold text-gray-800">₹{pkg.miscCost || '0'}</p>
                  </div>
                </div>
                <div className="bg-[#1B6E15] text-white p-6 rounded-xl text-center">
                  <p className="text-sm opacity-90">Total Package Cost</p>
                  <p className="text-4xl font-bold">₹{pkg.totalCost || '0'}</p>
                  {pkg.perPersonCost && (
                    <p className="text-sm mt-2 opacity-90">Per Person: ₹{pkg.perPersonCost}</p>
                  )}
                </div>
                <div className="text-center print:hidden">
                  <Button onClick={startEditingPrice} className="bg-[#FACC15] text-black hover:bg-yellow-400">
                    <Banknote className="w-4 h-4 mr-2" />
                    Edit Pricing
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hotel Cost</Label>
                    <Input
                      type="number"
                      value={priceForm.hotelCost}
                      onChange={(e) => setPriceForm({ ...priceForm, hotelCost: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Cost</Label>
                    <Input
                      type="number"
                      value={priceForm.vehicleCost}
                      onChange={(e) => setPriceForm({ ...priceForm, vehicleCost: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sightseeing Cost</Label>
                    <Input
                      type="number"
                      value={priceForm.sightseeingCost}
                      onChange={(e) => setPriceForm({ ...priceForm, sightseeingCost: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Miscellaneous</Label>
                    <Input
                      type="number"
                      value={priceForm.miscCost}
                      onChange={(e) => setPriceForm({ ...priceForm, miscCost: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Cost</Label>
                  <Input
                    type="number"
                    value={priceForm.totalCost}
                    onChange={(e) => setPriceForm({ ...priceForm, totalCost: e.target.value })}
                    placeholder="0"
                    className="text-lg font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Per Person Cost</Label>
                  <Input
                    type="number"
                    value={priceForm.perPersonCost}
                    onChange={(e) => setPriceForm({ ...priceForm, perPersonCost: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={savePrice} className="bg-[#1B6E15] hover:bg-[#145a10]">
                    <Save className="w-4 h-4 mr-2" />
                    Save Pricing
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingPrice(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* INCLUSIONS & EXCLUSIONS */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              Trip Inclusions & Exclusions
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#1B6E15] mb-4 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Inclusions
              </h3>
              <ul className="space-y-3">
                {template?.inclusions.map((inc: { id?: number; item: string }) => (
                  <li key={inc.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#1B6E15]" />
                    </div>
                    <span className="text-gray-700">{inc.item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <X className="w-5 h-5" />
                Exclusions
              </h3>
              <ul className="space-y-3">
                {template?.exclusions.map((exc: { id?: number; item: string }) => (
                  <li key={exc.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-600" />
                    </div>
                    <span className="text-gray-700">{exc.item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CHECKLIST */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              Checklist: Things to Carry
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {template?.checklist.map((item: { id?: number; item: string }) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[#1B6E15] flex items-center justify-center text-white shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-gray-700">{item.item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKING PROCESS */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              Booking Process
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="bg-[#1B6E15] text-white p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-3">Banking Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="opacity-70">Bank:</span> ICICI BANK LTD</p>
                  <p><span className="opacity-70">A/C Name:</span> Kashmir Meridian Tours And Travels</p>
                  <p><span className="opacity-70">A/C Number:</span> 260605001023</p>
                  <p><span className="opacity-70">IFSC:</span> ICIC0002606</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> 50% advance payment required to confirm booking. 
                  Remaining 50% to be paid on arrival.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-3">Scan to Pay / Contact</p>
              <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-[#1B6E15]">
                <QRCodeSVG
                  value={`upi://pay?pa=260605001023@icici&pn=Kashmir%20Meridian%20Tours&am=${pkg.totalCost || '0'}&cu=INR`}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                UPI ID: 260605001023@icici
              </p>
            </div>
          </div>
        </section>

        {/* CANCELLATION POLICY */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              Cancellation Policy
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-[#1B6E15]">
              <div className="w-10 h-10 rounded-full bg-[#1B6E15] flex items-center justify-center text-white font-bold shrink-0">
                30+
              </div>
              <div>
                <p className="font-semibold text-gray-800">30 Days or More Before Travel</p>
                <p className="text-gray-600 text-sm">Full refund minus 10% processing fee</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-[#FACC15]">
              <div className="w-10 h-10 rounded-full bg-[#FACC15] flex items-center justify-center text-black font-bold shrink-0">
                15-30
              </div>
              <div>
                <p className="font-semibold text-gray-800">15-30 Days Before Travel</p>
                <p className="text-gray-600 text-sm">50% refund of total package cost</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shrink-0">
                &lt;15
              </div>
              <div>
                <p className="font-semibold text-gray-800">Less Than 15 Days Before Travel</p>
                <p className="text-gray-600 text-sm">No refund applicable</p>
              </div>
            </div>
          </div>
        </section>

        {/* REMARKS */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 print:shadow-none print:rounded-none print:mb-0 print:break-after-page">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1B6E15]" style={{ fontFamily: 'Cambria, serif' }}>
              REMARKS
            </h2>
            <div className="w-24 h-1 bg-[#FACC15] mx-auto mt-4" />
          </div>
          <div className="space-y-4">
            {template?.remarks.map((remark: { id?: number; remark: string }) => (
              <div key={remark.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#1B6E15] mt-2 shrink-0" />
                <p className="text-gray-700 text-sm">{remark.remark}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT / FOOTER */}
        <section className="bg-[#1B6E15] text-white rounded-2xl shadow-xl p-8 print:shadow-none print:rounded-none print:mb-0">
          <div className="text-center">
            <img src="/images/logo.png" alt="Logo" className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Cambria, serif' }}>
              For Bookings Contact
            </h2>
            <div className="w-16 h-0.5 bg-[#FACC15] mx-auto mb-6" />
            <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center">
                <Phone className="w-6 h-6 mb-2 text-[#FACC15]" />
                <p className="text-sm opacity-90">+91 9906 000 000</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-6 h-6 mb-2 text-[#FACC15]" />
                <p className="text-sm opacity-90">info@kashmirmeridian.com</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-6 h-6 mb-2 text-[#FACC15]" />
                <p className="text-sm opacity-90">Srinagar, Kashmir</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-lg tracking-widest">WWW.KASHMRIMERIDIAN.COM</p>
              <p className="text-xs opacity-60 mt-2">© 2025 Kashmir Meridian Tours And Travels. All rights reserved.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function getStarCount(category: string): number {
  if (category.includes('4-star')) return 4
  if (category.includes('3-star')) return 3
  if (category.includes('2-star')) return 2
  return 3
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Hotel(_props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
      <path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16" />
      <path d="M8 7h.01" />
      <path d="M16 7h.01" />
      <path d="M12 7h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
      <path d="M8 11h.01" />
      <path d="M10 22v-6" />
      <path d="M14 22v-6" />
    </svg>
  )
}

function Car(_props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium text-gray-700 ${className || ''}`}>{children}</label>
}
