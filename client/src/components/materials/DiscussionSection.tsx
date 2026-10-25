'use client';

import React, { useState, useEffect } from 'react';
import { CommentItem, ApiResponse, User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import UserAvatar from '@/components/user/UserAvatar';
import {
  MessageSquare,
  Send,
  CornerDownRight,
  Trash2,
  Loader2,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DiscussionSectionProps {
  materialId: string;
}

export const DiscussionSection: React.FC<DiscussionSectionProps> = ({ materialId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submittingRoot, setSubmittingRoot] = useState<boolean>(false);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isCommentAuthor = (currentUser: any, authorObj: any): boolean => {
    if (!currentUser || !authorObj) return false;
    const currentUserId = currentUser.id || currentUser._id;
    const authorUserId = typeof authorObj === 'string' ? authorObj : (authorObj.id || authorObj._id);
    return Boolean(currentUserId && authorUserId && String(currentUserId) === String(authorUserId));
  };

  const getReplyContent = (commentId: string) => replyTexts[commentId] || '';
  const setReplyContent = (commentId: string, text: string) => {
    setReplyTexts((prev) => ({ ...prev, [commentId]: text }));
  };

  const fetchComments = async () => {
    try {
      const res = await api.get<ApiResponse<CommentItem[]>>(`/comments/materials/${materialId}`);
      if (res.data.success && res.data.data) {
        setComments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (materialId) {
      fetchComments();
    }
  }, [materialId]);

  const handlePostRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setSubmittingRoot(true);
    setErrorMessage('');
    try {
      const res = await api.post<ApiResponse<CommentItem>>(`/comments/materials/${materialId}`, {
        content: newCommentText.trim(),
      });
      if (res.data.success && res.data.data) {
        setComments([res.data.data, ...comments]);
        setNewCommentText('');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Không thể đăng bình luận lúc này');
    } finally {
      setSubmittingRoot(false);
    }
  };

  const handlePostReply = async (commentId: string) => {
    const text = getReplyContent(commentId).trim();
    if (!text) return;

    setSubmittingReplyId(commentId);
    setErrorMessage('');
    try {
      const res = await api.post<ApiResponse<CommentItem>>(`/comments/${commentId}/reply`, {
        content: text,
      });
      if (res.data.success && res.data.data) {
        // Cập nhật câu trả lời vào comment cấp 1 tương ứng
        setComments((prev) =>
          prev.map((c) => {
            if (c.id === commentId || c._id === commentId) {
              return {
                ...c,
                replies: [...(c.replies || []), res.data.data!],
              };
            }
            return c;
          })
        );
        setReplyTexts((prev) => {
          const next = { ...prev };
          delete next[commentId];
          return next;
        });
        setReplyingToId(null);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Không thể gửi phản hồi lúc này');
    } finally {
      setSubmittingReplyId(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    setDeletingId(commentId);
    try {
      const res = await api.delete(`/comments/${commentId}`);
      if (res.data.success) {
        await fetchComments();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi xóa bình luận');
    } finally {
      setDeletingId(null);
    }
  };

  const renderRoleBadge = (role?: string) => {
    if (role === 'admin') {
      return (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-extrabold text-red-700 tracking-wide">
          👑 Quản trị viên
        </span>
      );
    }
    if (role === 'teacher') {
      return (
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 tracking-wide">
          👨‍🏫 Giáo viên
        </span>
      );
    }
    return (
      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-brand-blue tracking-wide">
        🎒 Học sinh
      </span>
    );
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / (1000 * 60));
      if (mins < 1) return 'Vừa xong';
      if (mins < 60) return `${mins} phút trước`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} ngày trước`;
      return new Date(dateStr).toLocaleDateString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  const totalCommentCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
    0
  );

  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-white/60 bg-white/90 p-6 sm:p-10 shadow-lg backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-5 mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue text-brand-yellow shadow-sm">
            <MessageSquare className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Diễn Đàn Thảo Luận Bài Học
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Đặt câu hỏi, trao đổi với thầy cô và các bạn học trước buổi lên lớp
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-1 text-xs sm:text-sm font-bold text-brand-blue border border-sky-200/60 self-start sm:self-auto">
          <MessageCircle className="h-4 w-4" />
          <span>{totalCommentCount} thảo luận</span>
        </div>
      </div>

      {/* Main Comment Input Box (Cấp 1) */}
      {user ? (
        <form onSubmit={handlePostRootComment} className="mb-9 space-y-3">
          <div className="flex items-start gap-3">
            <UserAvatar avatar={user.avatar} name={user.fullName} size={40} />

            <div className="flex-1 space-y-2">
              <textarea
                rows={3}
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Viết câu hỏi hoặc chia sẻ ý kiến của bạn về bài học này (hỗ trợ gõ tiếng Việt có dấu)..."
                className="w-full rounded-2xl border border-slate-300 bg-white/90 p-3.5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all leading-relaxed"
              />

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Đăng dưới tên <strong>{user.fullName}</strong> ({user.role === 'teacher' ? 'Giáo viên' : user.role === 'admin' ? 'Quản trị viên' : 'Học sinh'})
                </span>
                <button
                  type="submit"
                  disabled={submittingRoot || !newCommentText.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-blue-dark active:scale-95 disabled:opacity-50 transition-all"
                >
                  {submittingRoot ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang đăng...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Đăng câu hỏi</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 rounded-2xl bg-sky-50 border border-sky-200 p-4 text-center text-sm text-slate-700">
          Vui lòng{' '}
          <a href="/dang-nhap" className="font-bold text-brand-blue underline">
            đăng nhập
          </a>{' '}
          để tham gia đặt câu hỏi và thảo luận bài học.
        </div>
      )}

      {/* Comments List (2 Cấp) */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center text-slate-500">
          <MessageSquare className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <p className="font-semibold text-slate-700 text-sm">Chưa có câu hỏi hoặc thảo luận nào</p>
          <p className="text-xs text-slate-500 mt-1">
            Hãy là người đầu tiên đặt câu hỏi để cùng thầy cô và các bạn thảo luận nhé!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((rootComment) => {
            const author = (rootComment.author || rootComment.authorId) as User;
            const canDeleteRoot = isCommentAuthor(user, author);
            const hasReplies = Boolean(rootComment.replies && rootComment.replies.length > 0);
            const rootId = rootComment.id || rootComment._id!;

            return (
              <div
                key={rootId}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-slate-300"
              >
                {/* Root Comment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar avatar={author?.avatar} name={author?.fullName} size={40} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {author?.fullName || 'Người dùng'}
                        </span>
                        {renderRoleBadge(author?.role)}
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(rootComment.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  {canDeleteRoot && rootComment.status !== 'deleted' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(rootId)}
                      disabled={deletingId === rootId}
                      className="rounded-lg p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Xóa bình luận"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Root Comment Content */}
                <div className="mt-3.5 pl-13 text-sm sm:text-base text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                  {rootComment.content}
                </div>

                {/* Root Comment Action Bar */}
                <div className="mt-3 pl-13 flex items-center gap-3 text-xs">
                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        if (hasReplies) {
                          // Nếu đã có phản hồi, focus vào ô nhập trả lời cố định bên dưới
                          const inputEl = document.getElementById(`reply-input-${rootId}`) as HTMLTextAreaElement | null;
                          if (inputEl) {
                            inputEl.focus();
                            inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        } else {
                          // Nếu chưa có phản hồi nào, toggle form mở ra như cũ
                          setReplyingToId(replyingToId === rootId ? null : rootId);
                        }
                      }}
                      className="inline-flex items-center gap-1 font-bold text-brand-blue hover:text-brand-blue-dark transition-colors"
                    >
                      <CornerDownRight className="h-3.5 w-3.5" />
                      <span>{!hasReplies && replyingToId === rootId ? 'Đóng' : 'Trả lời'}</span>
                    </button>
                  )}

                  {hasReplies && (
                    <span className="text-slate-400 font-medium">
                      • {rootComment.replies!.length} phản hồi
                    </span>
                  )}
                </div>

                {/* TRƯỜNG HỢP 1: Chưa có câu trả lời nào -> UI hiện như cũ (Toggle form) */}
                {!hasReplies && replyingToId === rootId && user && (
                  <div className="mt-4 ml-8 sm:ml-12 rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
                    <span className="text-xs font-bold text-slate-700">
                      Trả lời {author?.fullName || 'bình luận'}:
                    </span>
                    <textarea
                      rows={2}
                      value={getReplyContent(rootId)}
                      onChange={(e) => setReplyContent(rootId, e.target.value)}
                      placeholder="Nhập nội dung phản hồi của bạn..."
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs sm:text-sm text-slate-800 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          handlePostReply(rootId);
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePostReply(rootId)}
                        disabled={
                          submittingReplyId === rootId || !getReplyContent(rootId).trim()
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-brand-blue-dark disabled:opacity-50"
                      >
                        {submittingReplyId === rootId ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3" />
                        )}
                        <span>Gửi phản hồi</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TRƯỜNG HỢP 2: Đã từng có câu trả lời -> Danh sách phản hồi + Ô "trả lời" neo ngay bên dưới */}
                {hasReplies && (
                  <div className="mt-4 ml-6 sm:ml-12 space-y-3 border-l-2 border-brand-blue/30 pl-4 sm:pl-5">
                    {rootComment.replies!.map((reply) => {
                      const replyAuthor = (reply.author || reply.authorId) as User;
                      const canDeleteReply = isCommentAuthor(user, replyAuthor);

                      return (
                        <div
                          key={reply.id || reply._id}
                          className="rounded-xl bg-slate-50/80 border border-slate-200/70 p-3.5 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <UserAvatar avatar={replyAuthor?.avatar} name={replyAuthor?.fullName} size={28} />
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {replyAuthor?.fullName || 'Người dùng'}
                              </span>
                              {renderRoleBadge(replyAuthor?.role)}
                              <span className="text-[10px] text-slate-400">
                                • {formatRelativeTime(reply.createdAt)}
                              </span>
                            </div>

                            {canDeleteReply && reply.status !== 'deleted' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(reply.id || reply._id!)}
                                disabled={deletingId === (reply.id || reply._id)}
                                className="rounded p-1 text-slate-400 hover:text-red-500 transition-colors"
                                title="Xóa câu trả lời"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-9 whitespace-pre-wrap">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}

                    {/* Ô "Trả lời" bình luận hiển thị ngay dưới các câu trả lời */}
                    {user ? (
                      <div className="mt-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 p-3 sm:p-3.5 shadow-2xs transition-all focus-within:border-brand-blue/50 focus-within:ring-2 focus-within:ring-brand-blue/10">
                        <div className="flex items-start gap-2.5">
                          <UserAvatar avatar={user.avatar} name={user.fullName} size={30} />
                          <div className="flex-1 space-y-2">
                            <textarea
                              id={`reply-input-${rootId}`}
                              rows={2}
                              value={getReplyContent(rootId)}
                              onChange={(e) => setReplyContent(rootId, e.target.value)}
                              placeholder={`Trả lời thảo luận của ${author?.fullName || 'bài học'}...`}
                              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-blue focus:outline-none transition-all leading-relaxed"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                  e.preventDefault();
                                  handlePostReply(rootId);
                                }
                              }}
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-400 hidden sm:inline">
                                Nhấn <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px]">Ctrl+Enter</kbd> để gửi nhanh
                              </span>
                              <div className="flex items-center gap-2 ml-auto">
                                {getReplyContent(rootId).trim() && (
                                  <button
                                    type="button"
                                    onClick={() => setReplyContent(rootId, '')}
                                    className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-200 transition-colors"
                                  >
                                    Xóa
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handlePostReply(rootId)}
                                  disabled={submittingReplyId === rootId || !getReplyContent(rootId).trim()}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-brand-blue-dark active:scale-95 disabled:opacity-50 transition-all"
                                >
                                  {submittingReplyId === rootId ? (
                                    <>
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      <span>Đang gửi...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-3 w-3" />
                                      <span>Gửi phản hồi</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl bg-slate-50/80 border border-dashed border-slate-300 p-3 text-center text-xs text-slate-600">
                        <a href="/dang-nhap" className="font-bold text-brand-blue hover:underline">
                          Đăng nhập
                        </a>{' '}
                        để tham gia trả lời thảo luận này.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DiscussionSection;
