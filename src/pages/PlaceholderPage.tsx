import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-emerald-50 p-6 rounded-full text-emerald-600 mb-6">
        <Construction className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-500 max-w-md">
        This page is currently under construction. We are working hard to bring you the best experience.
      </p>
    </div>
  );
}
