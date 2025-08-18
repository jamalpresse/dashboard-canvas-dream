import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { submitTranscription } from '@/services/transcriptionService';
import { useToast } from '@/hooks/use-toast';
import { FileImage, Loader2, Upload } from 'lucide-react';

export default function Transcription() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await submitTranscription(file, notes ? { notes } : undefined);
      
      if (response.ok && response.data) {
        setResult(response.data);
        toast({
          title: "Succès",
          description: "Transcription terminée avec succès",
        });
      } else {
        const errorMsg = response.error || 'Erreur lors de la transcription';
        setError(errorMsg);
        toast({
          title: "Erreur",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMsg);
      toast({
        title: "Erreur",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {t('dashboard', 'transcription') || 'Transcription Image'}
        </h1>
        <p className="text-muted-foreground">
          Téléchargez une image pour extraire et transcrire son contenu textuel
        </p>
      </div>

      <div className="grid gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Upload Image
            </CardTitle>
            <CardDescription>
              Sélectionnez une image contenant du texte à transcrire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="mt-1"
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Fichier sélectionné: {file.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ajoutez des notes ou instructions spécifiques..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                disabled={!file || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transcription en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Commencer la transcription
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {(result || error) && (
          <Card>
            <CardHeader>
              <CardTitle className={error ? "text-destructive" : "text-primary"}>
                {error ? "Erreur" : "Résultat de la transcription"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-destructive bg-destructive/10 p-4 rounded-lg">
                  <p className="font-medium">Une erreur s'est produite:</p>
                  <p className="mt-1">{error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Réponse JSON:</h4>
                    <pre className="whitespace-pre-wrap text-sm overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}