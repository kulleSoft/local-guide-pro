import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const TERMS_KEY = 'foodmap_terms_accepted';

export function TermsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(TERMS_KEY);
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(TERMS_KEY, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Bem-vindo ao Foodmap! 🍽️
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Antes de continuar, leia e aceite nossos termos de uso.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-3">
          <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
            <section>
              <h3 className="font-semibold text-foreground mb-1">1. Aceitação dos Termos</h3>
              <p>
                Ao utilizar o aplicativo Foodmap, você concorda com todos os termos e condições
                descritos neste documento. Caso não concorde, por favor, não utilize o aplicativo.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">2. Sobre o Foodmap</h3>
              <p>
                O Foodmap é uma plataforma de descoberta de lugares como restaurantes, bares, cafés
                e outros estabelecimentos. As informações exibidas são fornecidas pelos
                estabelecimentos e pela comunidade.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">3. Exibição de Anúncios</h3>
              <p>
                O Foodmap é um serviço gratuito e, para mantê-lo disponível, <strong>exibimos
                anúncios publicitários</strong> em diversas seções do aplicativo. Os anúncios podem
                incluir banners, conteúdo patrocinado e promoções de parceiros. Ao utilizar o
                Foodmap, você concorda com a exibição desses anúncios.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">4. Privacidade e Dados</h3>
              <p>
                Coletamos dados de uso anônimos para melhorar a experiência no aplicativo e
                personalizar os anúncios exibidos. Não compartilhamos suas informações pessoais
                com terceiros sem seu consentimento.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">5. Conteúdo e Avaliações</h3>
              <p>
                As avaliações e comentários são de responsabilidade dos usuários que os publicam.
                O Foodmap reserva-se o direito de remover conteúdo que viole nossas diretrizes.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-1">6. Alterações nos Termos</h3>
              <p>
                O Foodmap pode atualizar estes termos a qualquer momento. Recomendamos que você
                revise periodicamente.
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={handleAccept} className="w-full rounded-xl font-semibold">
            Li e aceito os termos de uso
          </Button>
          <p className="text-[10px] text-muted-foreground text-center">
            Ao clicar, você concorda com os Termos de Uso e a Política de Privacidade do Foodmap.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
