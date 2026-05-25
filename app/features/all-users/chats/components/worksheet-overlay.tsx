import { useEffect, useState } from 'react';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/common/components/ui/accordion';
import { Button } from '~/common/components/ui/button';
import { Card } from '~/common/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '~/common/components/ui/item';
import { Textarea } from '~/common/components/ui/textarea';
import { cn } from '~/lib/utils';
import { EMOTION_CATEGORIES } from './emotions.constants';
import {
  WORKSHEETS,
  WORKSHEET_LIST,
  type WorksheetType,
} from './worksheets.constants';

interface WorksheetOverlayProps {
  open: boolean;
  onClose: () => void;
}

type Step = 'select' | 'fill' | 'emotions';

const PAGE_COUNT = 6;

export function WorksheetOverlay({ open, onClose }: WorksheetOverlayProps) {
  const [step, setStep] = useState<Step>('select');
  const [worksheetType, setWorksheetType] = useState<WorksheetType | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() =>
    Array(PAGE_COUNT).fill('')
  );

  // 박스 닫기 = 즉시 휘발 (메모리 state 초기화)
  useEffect(() => {
    if (!open) {
      setStep('select');
      setWorksheetType(null);
      setPageIndex(0);
      setAnswers(Array(PAGE_COUNT).fill(''));
    }
  }, [open]);

  if (!open) return null;

  const handleSelect = (type: WorksheetType) => {
    setWorksheetType(type);
    setPageIndex(0);
    setAnswers(Array(PAGE_COUNT).fill(''));
    setStep('fill');
  };

  const handleSelectEmotions = () => {
    setStep('emotions');
  };

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[pageIndex] = value;
      return next;
    });
  };

  const handlePrev = () => setPageIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setPageIndex((i) => Math.min(PAGE_COUNT - 1, i + 1));

  const handleBackToSelect = () => {
    setStep('select');
    setWorksheetType(null);
    setPageIndex(0);
    setAnswers(Array(PAGE_COUNT).fill(''));
  };

  const handleSaveOrComplete = () => {
    // TODO(backend): 저장 mutation 호출
    //   const payload = { type: worksheetType, answers };
    //   await fetcher.submit({ intent: 'save-worksheet', payload: JSON.stringify(payload) }, { method: 'post' });
    onClose();
  };

  const currentMeta =
    step === 'fill' && worksheetType ? WORKSHEETS[worksheetType] : null;
  const currentPage = currentMeta?.pages[pageIndex];
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === PAGE_COUNT - 1;

  return (
    <Card className="absolute right-2 top-16 bottom-2 w-2/3 z-20 flex flex-col shadow-xl overflow-hidden p-0">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
        <h3 className="font-semibold text-base">
          {step === 'emotions'
            ? '감정 목록'
            : currentMeta
              ? currentMeta.title
              : 'The Work 워크시트'}
        </h3>
        {step !== 'select' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToSelect}
            aria-label="워크시트 선택으로 돌아가기"
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6">
        {step === 'select' && (
          <SelectScreen
            onSelect={handleSelect}
            onSelectEmotions={handleSelectEmotions}
          />
        )}
        {step === 'fill' && currentPage && (
          <FillScreen
            page={currentPage}
            value={answers[pageIndex]}
            onChange={handleAnswerChange}
          />
        )}
        {step === 'emotions' && <EmotionsScreen />}
      </div>

      {/* 페이지네이션 (작성 화면에서만) */}
      {step === 'fill' && (
        <div className="flex items-center justify-between border-t px-5 py-3 shrink-0 gap-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: PAGE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPageIndex(i)}
                aria-label={`${i + 1}번 페이지로 이동`}
                className={cn(
                  'size-2 rounded-full transition-colors',
                  i === pageIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {!isFirstPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrev}
                aria-label="이전 페이지"
              >
                <ChevronLeftIcon className="size-5" />
              </Button>
            )}
            {isLastPage ? (
              <Button onClick={handleSaveOrComplete} size="sm">
                전송
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                aria-label="다음 페이지"
              >
                <ChevronRightIcon className="size-5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

interface SelectScreenProps {
  onSelect: (type: WorksheetType) => void;
  onSelectEmotions: () => void;
}

function SelectScreen({ onSelect, onSelectEmotions }: SelectScreenProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        시작할 양식을 선택해주세요.
      </p>
      <ItemGroup className="gap-3">
        {WORKSHEET_LIST.map((worksheet) => (
          <Item key={worksheet.type} variant="outline">
            <ItemContent>
              <ItemTitle>{worksheet.title}</ItemTitle>
              <ItemDescription className="line-clamp-none">
                {worksheet.description}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" onClick={() => onSelect(worksheet.type)}>
                사용
              </Button>
            </ItemActions>
          </Item>
        ))}
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>감정 목록</ItemTitle>
            <ItemDescription className="line-clamp-none">
              The Work 작업 중 감정을 찾기 어려울 때 참고할 수 있는 감정 단어
              목록입니다. 단어를 클릭하면 복사됩니다.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" onClick={onSelectEmotions}>
              사용
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  );
}

function EmotionsScreen() {
  const handleCopy = async (word: string) => {
    try {
      await navigator.clipboard.writeText(word);
      toast.success('복사되었습니다');
    } catch {
      toast.error('복사에 실패했습니다');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        단어를 클릭하면 클립보드에 복사됩니다. 작성 중인 양식에 붙여 넣어
        사용하세요.
      </p>
      <Accordion type="multiple" className="w-full">
        {EMOTION_CATEGORIES.map((category) => (
          <AccordionItem key={category.key} value={category.key}>
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-baseline gap-2">
                <span className="font-semibold">{category.label}</span>
                <span className="text-xs text-muted-foreground">
                  {category.englishLabel}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({category.words.length})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2">
                {category.words.map((word, idx) => (
                  <button
                    key={`${category.key}-${idx}`}
                    type="button"
                    onClick={() => handleCopy(word)}
                    className="text-sm text-foreground hover:underline underline-offset-4 cursor-pointer transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

interface FillScreenProps {
  page: {
    subtitle: string;
    guide: string;
    template?: string;
    example?: string;
  };
  value: string;
  onChange: (value: string) => void;
}

function FillScreen({ page, value, onChange }: FillScreenProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-lg font-semibold">{page.subtitle}</h4>

      <div className="rounded-md bg-muted/50 p-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p className="whitespace-pre-line">{page.guide}</p>

        {page.template && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1">형식</p>
            <p className="whitespace-pre-line">{page.template}</p>
          </div>
        )}

        {page.example && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1">예시</p>
            <p className="whitespace-pre-line italic">{page.example}</p>
          </div>
        )}
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="여기에 작성해주세요..."
        className="min-h-[200px] resize-y"
      />
    </div>
  );
}
