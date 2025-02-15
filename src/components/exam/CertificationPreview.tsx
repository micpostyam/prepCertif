import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Certification } from '@/types/certification'

interface CertificationPreviewProps {
  certification: Certification
  onBack: () => void
  onStart: () => void
}

export function CertificationPreview({ certification, onBack, onStart }: CertificationPreviewProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{certification.name}</h1>
        <div className="space-y-4">
          <p className="text-gray-600">{certification.description}</p>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-semibold">Nombre de questions:</span> {certification.numberOfQuestions}
            </div>
            <div>
              <span className="font-semibold">Durée:</span> {certification.duration} minutes
            </div>
          </div>
        </div>
        <Button onClick={onStart} size="lg">
          Démarrer l&apos;examen
        </Button>
      </div>
    </div>
  )
}
