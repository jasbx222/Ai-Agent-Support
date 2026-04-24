import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Box,
  Typography,
  Paper,
  alpha,
  Chip,
  IconButton,
  Divider,
  Collapse,
} from '@mui/material';
import DashboardLayout from '../../Layouts/DashboardLayout';
import {
  User as UserIcon,
  Calendar,
  ArrowRight,
  Ticket,
  Bot,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Tag,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from 'lucide-react';

interface Usage {
  total_tokens: number;
  cost_usd: number | null;
}

interface TimelineItem {
  type: 'ticket' | 'ai_run';
  id: number;
  prompt: string | null;
  response: string | null;
  status: string;
  model?: string;
  usage?: Usage | null;
  date: string;
  display_date: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface Props {
  customer: Customer;
  timeline?: TimelineItem[];
}

type ParsedAiResponse = Record<string, unknown> & {
  reply?: string;
  classification?: string;
  department?: string;
  priority?: string;
  sentiment?: string;
  summary?: string;
};

type ParsedResponse =
  | { type: 'ai_structured'; data: ParsedAiResponse }
  | { type: 'text'; data: string }
  | null;

function tryJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseResponse(raw: string | null): ParsedResponse {
  if (!raw) return null;

  const parsed = tryJsonParse(raw);

  if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>;

    if (typeof obj.text === 'string') {
      const nested = tryJsonParse(obj.text);

      if (typeof nested === 'object' && nested !== null) {
        return { type: 'ai_structured', data: nested as ParsedAiResponse };
      }

      return { type: 'text', data: String(nested) };
    }

    if ('reply' in obj || 'classification' in obj) {
      return { type: 'ai_structured', data: obj as ParsedAiResponse };
    }

    return { type: 'text', data: JSON.stringify(obj, null, 2) };
  }

  return { type: 'text', data: String(parsed) };
}

function valueToText(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value, null, 2);
}

function SentimentBadge({ value }: { value: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    negative: { color: '#f44336', bg: 'rgba(244,67,54,0.1)' },
    positive: { color: '#4caf50', bg: 'rgba(76,175,80,0.1)' },
    neutral: { color: '#9e9e9e', bg: 'rgba(158,158,158,0.1)' },
  };

  const cfg = map[value.toLowerCase()] ?? {
    color: '#9fcaff',
    bg: 'rgba(159,202,255,0.1)',
  };

  return (
    <Chip
      label={value}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontSize: '0.6rem',
        height: 18,
      }}
    />
  );
}

function PriorityBadge({ value }: { value: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    high: { color: '#f44336', bg: 'rgba(244,67,54,0.1)' },
    medium: { color: '#ff9800', bg: 'rgba(255,152,0,0.1)' },
    low: { color: '#4caf50', bg: 'rgba(76,175,80,0.1)' },
  };

  const cfg = map[value.toLowerCase()] ?? {
    color: '#9fcaff',
    bg: 'rgba(159,202,255,0.1)',
  };

  return (
    <Chip
      label={value}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontSize: '0.6rem',
        height: 18,
      }}
    />
  );
}

function AiStatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; color: string; bg: string; Icon: LucideIcon }
  > = {
    success: {
      label: 'نجح',
      color: '#4caf50',
      bg: 'rgba(76,175,80,0.1)',
      Icon: CheckCircle,
    },
    failed: {
      label: 'فشل',
      color: '#f44336',
      bg: 'rgba(244,67,54,0.1)',
      Icon: XCircle,
    },
    rate_limited: {
      label: 'rate limit',
      color: '#ff9800',
      bg: 'rgba(255,152,0,0.1)',
      Icon: AlertCircle,
    },
  };

  const cfg = map[status?.toLowerCase()] ?? {
    label: status || 'غير معروف',
    color: '#8b919c',
    bg: 'rgba(139,145,156,0.1)',
    Icon: AlertCircle,
  };

  const Icon = cfg.Icon;

  return (
    <Chip
      icon={<Icon size={11} color={cfg.color} />}
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bg,
        color: cfg.color,
        fontSize: '0.65rem',
        height: 20,
      }}
    />
  );
}

function AiResponseCard({ data }: { data: ParsedAiResponse }) {
  const [expanded, setExpanded] = useState(false);

  const reply = valueToText(data.reply);
  const classification = valueToText(data.classification);

  const metaKeys = Object.keys(data).filter(
    (key) => !['reply', 'classification'].includes(key)
  );

  return (
    <Box>
      {classification && (
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tag size={12} color="#9fcaff" />
          <Typography
            variant="caption"
            sx={{ color: alpha('#9fcaff', 0.7), fontStyle: 'italic' }}
          >
            {classification}
          </Typography>
        </Box>
      )}

      {reply && (
        <Typography
          variant="body2"
          sx={{ lineHeight: 1.85, color: '#dde2f3', whiteSpace: 'pre-wrap' }}
        >
          {reply}
        </Typography>
      )}

      {metaKeys.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Box
            onClick={() => setExpanded((prev) => !prev)}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'pointer',
              color: alpha('#9fcaff', 0.5),
              '&:hover': { color: '#9fcaff' },
              transition: 'color .2s',
            }}
          >
            <Typography variant="caption">تفاصيل التصنيف</Typography>
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </Box>

          <Collapse in={expanded}>
            <Box
              sx={{
                mt: 1,
                p: 1.5,
                bgcolor: alpha('#000', 0.2),
                borderRadius: 2,
                border: `1px solid ${alpha('#9fcaff', 0.08)}`,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {metaKeys.map((key) => {
                const val = valueToText(data[key]);
                if (!val) return null;

                if (key === 'sentiment') {
                  return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: alpha('#9fcaff', 0.5) }}>
                        مزاج:
                      </Typography>
                      <SentimentBadge value={val} />
                    </Box>
                  );
                }

                if (key === 'priority') {
                  return (
                    <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: alpha('#9fcaff', 0.5) }}>
                        أولوية:
                      </Typography>
                      <PriorityBadge value={val} />
                    </Box>
                  );
                }

                if (key === 'summary') {
                  return (
                    <Box key={key} sx={{ width: '100%', mt: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha('#9fcaff', 0.5),
                          display: 'block',
                          mb: 0.3,
                        }}
                      >
                        ملخص:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: '#9fcaff', whiteSpace: 'pre-wrap' }}
                      >
                        {val}
                      </Typography>
                    </Box>
                  );
                }

                return (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: alpha('#9fcaff', 0.5) }}>
                      {key}:
                    </Typography>
                    <Chip
                      label={val}
                      size="small"
                      sx={{
                        bgcolor: alpha('#9fcaff', 0.08),
                        color: '#9fcaff',
                        fontSize: '0.6rem',
                        height: 18,
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>
      )}

      {!reply && metaKeys.length === 0 && (
        <Typography
          variant="body2"
          sx={{ color: alpha('#9fcaff', 0.4), fontStyle: 'italic' }}
        >
          لا يوجد رد
        </Typography>
      )}
    </Box>
  );
}

export default function Show({ customer, timeline = [] }: Props) {
  const sorted = useMemo(() => {
    return [...timeline].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [timeline]);

  return (
    <DashboardLayout>
      <Head title={`محادثات العميل: ${customer.name}`} />

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <IconButton
          component={Link}
          href="/customers"
          sx={{ bgcolor: alpha('#9fcaff', 0.1), color: '#9fcaff', mt: 0.5 }}
        >
          <ArrowRight size={20} />
        </IconButton>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#dde2f3' }}>
            {customer.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {customer.email}
            </Typography>

            <Chip
              icon={<Calendar size={12} />}
              label={`انضم: ${new Date(customer.created_at).toLocaleDateString('ar-SA')}`}
              size="small"
              sx={{
                bgcolor: alpha('#8b919c', 0.1),
                color: '#8b919c',
                fontSize: '0.7rem',
              }}
            />

            <Chip
              label={`${timeline.length} تفاعل`}
              size="small"
              sx={{
                bgcolor: alpha('#4894e2', 0.1),
                color: '#4894e2',
                fontSize: '0.7rem',
              }}
            />
          </Box>
        </Box>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, md: 4 },
          bgcolor: alpha('#161c27', 0.5),
          borderRadius: 4,
          border: `1px solid ${alpha('#9fcaff', 0.1)}`,
          minHeight: '60vh',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: '#4894e2',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Clock size={20} /> السجل الكامل
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          جميع التذاكر وردود الذكاء الاصطناعي مرتبة زمنياً
        </Typography>

        <Divider sx={{ mb: 4, borderColor: alpha('#ffffff', 0.05) }} />

        {sorted.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography>لا يوجد محادثات أو تذاكر لهذا العميل حتى الآن.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sorted.map((item) => {
              const isAi = item.type === 'ai_run';
              const parsed = parseResponse(item.response);
              const status = item.status?.toLowerCase();

              return (
                <Box
                  key={`${item.type}-${item.id}`}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  {item.prompt && (
                    <Box sx={{ maxWidth: { xs: '100%', md: '75%' }, alignSelf: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, px: 1 }}>
                        <UserIcon size={13} color="#8b919c" />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          العميل
                        </Typography>
                        <Typography variant="caption" sx={{ color: alpha('#8b919c', 0.4) }}>
                          · {item.display_date}
                        </Typography>
                        {!isAi && (
                          <Chip
                            icon={<Ticket size={10} />}
                            label={`#${item.id}`}
                            size="small"
                            sx={{
                              bgcolor: alpha('#8b919c', 0.1),
                              color: '#8b919c',
                              fontSize: '0.6rem',
                              height: 18,
                            }}
                          />
                        )}
                      </Box>

                      <Paper
                        sx={{
                          p: 2,
                          px: 2.5,
                          bgcolor: '#2f3542',
                          color: '#dde2f3',
                          borderRadius: '4px 16px 16px 16px',
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                          {item.prompt}
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Box sx={{ maxWidth: { xs: '100%', md: '75%' }, alignSelf: 'flex-end', ml: 'auto' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 0.5,
                        px: 1,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#4894e2', fontWeight: 600 }}>
                        {isAi ? 'الذكاء الاصطناعي' : 'النظام'}
                      </Typography>
                      {isAi ? <Bot size={13} color="#4894e2" /> : <Ticket size={13} color="#4894e2" />}
                    </Box>

                    <Paper
                      sx={{
                        p: 2.5,
                        bgcolor: alpha('#153d5a', 0.6),
                        color: '#9fcaff',
                        borderRadius: '16px 4px 16px 16px',
                        border: `1px solid ${alpha('#4894e2', 0.15)}`,
                        minWidth: 220,
                      }}
                    >
                      {parsed === null ? (
                        <Typography
                          variant="body2"
                          sx={{ color: alpha('#9fcaff', 0.4), fontStyle: 'italic' }}
                        >
                          {status === 'open'
                            ? 'في انتظار الرد...'
                            : isAi && status !== 'success'
                              ? 'لم يتم توليد رد'
                              : 'لا يوجد رد'}
                        </Typography>
                      ) : parsed.type === 'ai_structured' ? (
                        <AiResponseCard data={parsed.data} />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', color: '#dde2f3' }}
                        >
                          {parsed.data}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          mt: 2,
                          pt: 1.5,
                          borderTop: `1px dashed ${alpha('#4894e2', 0.2)}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ color: alpha('#9fcaff', 0.4) }}>
                          {item.display_date}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', flexWrap: 'wrap' }}>
                          {!isAi && (
                            <Chip
                              label={item.status}
                              size="small"
                              sx={{
                                bgcolor:
                                  status === 'open'
                                    ? 'rgba(255,152,0,0.1)'
                                    : 'rgba(76,175,80,0.1)',
                                color: status === 'open' ? '#ff9800' : '#4caf50',
                                fontSize: '0.6rem',
                                height: 18,
                              }}
                            />
                          )}

                          {isAi && <AiStatusBadge status={item.status} />}

                          {isAi && item.model && (
                            <Chip
                              label={item.model}
                              size="small"
                              sx={{
                                bgcolor: alpha('#000', 0.3),
                                color: '#aaa',
                                fontSize: '0.6rem',
                                height: 18,
                              }}
                            />
                          )}

                          {isAi && item.usage && item.usage.total_tokens > 0 && (
                            <Chip
                              label={`${item.usage.total_tokens} tokens`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(76,175,80,0.1)',
                                color: '#4caf50',
                                fontSize: '0.6rem',
                                height: 18,
                              }}
                            />
                          )}

                          {isAi && item.usage?.cost_usd !== null && item.usage?.cost_usd !== undefined && (
                            <Chip
                              label={`$${item.usage.cost_usd}`}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(156,39,176,0.1)',
                                color: '#ce93d8',
                                fontSize: '0.6rem',
                                height: 18,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
    </DashboardLayout>
  );
}