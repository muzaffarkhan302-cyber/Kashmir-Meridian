import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Eye, FileText, Trash2, Package } from 'lucide-react'

export default function Home() {
  const { data: packages, refetch: refetchPackages } = trpc.package.list.useQuery()
  const { data: templates } = trpc.template.list.useQuery()
  const deletePackage = trpc.package.delete.useMutation({ onSuccess: () => refetchPackages() })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1B6E15] text-white py-6 px-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo.png" alt="Kashmir Meridian" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h1 className="text-2xl font-bold tracking-wide">KASHMIR MERIDIAN</h1>
              <p className="text-xs text-green-200 tracking-widest">EXPLORE WITH US • EST. 2009</p>
            </div>
          </div>
          <Link to="/builder">
            <Button className="bg-[#FACC15] text-black hover:bg-yellow-400 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              New Itinerary
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white border-l-4 border-[#1B6E15]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Packages</p>
                  <p className="text-3xl font-bold text-[#1B6E15]">{packages?.length || 0}</p>
                </div>
                <Package className="w-10 h-10 text-[#1B6E15] opacity-30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-[#29BD20]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Templates</p>
                  <p className="text-3xl font-bold text-[#29BD20]">{templates?.length || 0}</p>
                </div>
                <FileText className="w-10 h-10 text-[#29BD20] opacity-30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-l-4 border-[#FACC15]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <p className="text-lg font-bold text-gray-700">www.kashmirmeridian.com</p>
                </div>
                <Eye className="w-10 h-10 text-[#FACC15] opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1B6E15]" />
            Generated Itineraries
          </h2>
          {packages && packages.length > 0 ? (
            <div className="grid gap-4">
              {packages.map((pkg: { id?: number; customerName: string; travelDate: string | null; hotelCategory: string; numAdults: number | null; totalCost: string | null }) => (
                <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1B6E15] flex items-center justify-center text-white font-bold">
                        {pkg.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{pkg.customerName}</p>
                        <p className="text-sm text-gray-500">
                          {pkg.travelDate} • {pkg.hotelCategory} • {pkg.numAdults} Adults
                        </p>
                        {pkg.totalCost && (
                          <p className="text-sm font-semibold text-[#1B6E15]">₹{pkg.totalCost}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/itinerary/${pkg.id}`}>
                        <Button variant="outline" size="sm" className="border-[#1B6E15] text-[#1B6E15] hover:bg-[#1B6E15] hover:text-white">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => pkg.id && deletePackage.mutate({ id: pkg.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-100 border-dashed border-2">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 mb-4">No itineraries generated yet</p>
                <Link to="/builder">
                  <Button className="bg-[#1B6E15] hover:bg-[#145a10]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Itinerary
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#29BD20]" />
            Available Templates
          </h2>
          {templates && templates.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((t: { id?: number; code: string | null; name: string | null; coverImage: string | null; durationDays: number | null; durationNights: number | null; subtitle: string | null }) => (
                <Card key={t.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: `url(${t.coverImage || '/images/cover-bg.jpg'})` }}>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-3 left-4 text-white">
                      <p className="text-xs font-semibold bg-[#1B6E15] inline-block px-2 py-0.5 rounded">{t.code}</p>
                      <p className="text-lg font-bold">{t.name}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">{t.durationDays}D / {t.durationNights}N • {t.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No templates available</p>
          )}
        </div>
      </main>
    </div>
  )
}
