import { useState } from 'react';
import { ArrowLeft, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { submitPdfTranscription } from '@/services/pdfTranscriptionService';

export default function PdfTranscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Erreur',
          description: 'Veuillez sélectionner un fichier PDF valide.',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier PDF.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const extraFields = notes ? { notes } : undefined;
      const response = await submitPdfTranscription(file, extraFields);

      if (response.ok && response.data) {
        setResult(response.data);
        toast({
          title: 'Succès',
          description: 'Transcription PDF terminée avec succès.',
        });
      } else {
        const errorMessage = response.error || response.body || 'Erreur lors de la transcription';
        setError(errorMessage);
        toast({
          title: 'Erreur',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transcription PDF</h1>
          <p className="text-muted-foreground">
            Téléversez un fichier PDF pour obtenir sa transcription
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Téléverser un PDF
            </CardTitle>
            <CardDescription>
              Sélectionnez le fichier PDF que vous souhaitez transcrire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-file">Fichier PDF</Label>
                <Input
                  id="pdf-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Fichier sélectionné: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajoutez des notes ou instructions particulières..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={!file || loading} className="w-full">
                {loading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Transcription en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Transcrire le PDF
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
            <CardDescription>
              Le résultat de la transcription apparaîtra ici
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Transcription en cours...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <h4 className="font-medium text-destructive mb-2">Erreur</h4>
                <pre className="text-sm text-destructive whitespace-pre-wrap">{error}</pre>
              </div>
            )}

            {result && (
              <div className="bg-muted/50 border rounded-md p-4">
                <h4 className="font-medium mb-2">Transcription réussie</h4>
                <pre className="text-sm whitespace-pre-wrap bg-background p-3 rounded border max-h-96 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}

            {!loading && !error && !result && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Aucun résultat pour le moment</p>
                <p className="text-xs">Téléversez un PDF pour commencer</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}