import { inMemoryPosts } from '../posts/index';
import { isCrisis } from '../../../lib/crisis-keywords';
import { makeHandle } from '../../../lib/handle';

// Telegram Bot Integration Webhook (/api/telegram/webhook)
// Handles incoming anonymous confessions and echo reactions from Telegram @SafeSpaceSupportBot

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, status: 'SafeSpace Telegram Bot Webhook Active' });
  }

  try {
    const { message, callback_query } = req.body || {};

    // 1. Handle Inline Reaction Button Clicks in Telegram
    if (callback_query) {
      const { data, message: cbMsg } = callback_query; // e.g. "echo_post-1_hear"
      if (data && data.startsWith('echo_')) {
        const parts = data.split('_'); // ['echo', 'post-id', 'type']
        const postId = parts[1];
        const echoType = parts[2];

        const target = inMemoryPosts.find((p) => p.id === postId);
        if (target && ['hear', 'alone', 'strength'].includes(echoType)) {
          target[echoType] = (target[echoType] || 0) + 1;
        }

        return res.status(200).json({
          method: 'answerCallbackQuery',
          callback_query_id: callback_query.id,
          text: `💜 Sent "${echoType}" reaction anonymously!`,
        });
      }
    }

    // 2. Handle Incoming Anonymous Confessions via Telegram Message
    if (message && message.text) {
      const text = message.text.trim();
      const chatId = message.chat.id;

      // Command: /start
      if (text === '/start') {
        return res.status(200).json({
          method: 'sendMessage',
          chat_id: chatId,
          text: `💜 Welcome to SafeSpace Anonymous Peer Support!\n\nSend any confession or feeling here, or type /confess [your text].\n100% Anonymous • Zero Followers • Built-in AI Crisis Safety.`,
        });
      }

      // Confession Body Extraction
      let bodyText = text;
      if (text.startsWith('/confess')) {
        bodyText = text.replace('/confess', '').trim();
      }

      if (!bodyText) {
        return res.status(200).json({
          method: 'sendMessage',
          chat_id: chatId,
          text: 'Please write your confession after /confess (e.g. /confess I feel overwhelmed with school...)',
        });
      }

      // Check AI Crisis Language
      const crisis = isCrisis(bodyText);
      const randomHandle = makeHandle();

      const newPost = {
        id: `telegram-${Date.now()}`,
        handle: randomHandle,
        body: bodyText,
        hear: 0,
        alone: 0,
        strength: 0,
        category: 'Telegram Vent',
        created_at: new Date().toISOString(),
        flagged: crisis,
        hidden: false,
      };

      if (!crisis) {
        inMemoryPosts.unshift(newPost);
      }

      if (crisis) {
        return res.status(200).json({
          method: 'sendMessage',
          chat_id: chatId,
          text: `🚨 We are concerned about you.\n\nYou mentioned words that indicate you may be in crisis. You are not alone.\n\nImmediate 24/7 Helplines:\n📞 Ethiopia Mental Health Helpline: +251 118 72 60 90 (or 8335)\n🚑 Red Cross Emergency: 907\n👥 Youth Counseling: +251 911 20 30 40`,
        });
      }

      return res.status(200).json({
        method: 'sendMessage',
        chat_id: chatId,
        text: `✅ Your confession was posted anonymously as "${randomHandle}" on SafeSpace!\n\nView feed: http://localhost:3002/feed`,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Telegram webhook error:', err);
    return res.status(200).json({ ok: true });
  }
}
