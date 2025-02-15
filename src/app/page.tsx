import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold mb-4">
          Préparez vos certifications en toute confiance
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Une plateforme complète pour vous entraîner et réussir vos examens de certification.
          Accédez à des milliers de questions et suivez votre progression.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Se connecter
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-2">Questions à jour</h3>
            <p className="text-gray-600 dark:text-gray-300">Des questions régulièrement mises à jour par nos experts</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-2">Suivi détaillé</h3>
            <p className="text-gray-600 dark:text-gray-300">Analysez vos performances et votre progression</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold mb-2">Mode examen</h3>
            <p className="text-gray-600 dark:text-gray-300">Entraînez-vous dans des conditions réelles</p>
          </div>
        </div>
      </main>
    </div>
  );
}
