
import { Mood, Dialogue } from './types.ts';

export const GREETINGS: Record<string, Dialogue[]> = {
  morning: [
    { text: "早安。看你揉眼睛的样子，还没睡醒吗？", mood: Mood.TEASING },
    { text: "为你泡了咖啡，窗外的阳光刚刚好。", mood: Mood.CALM },
    { text: "新的一天，希望第一个见到的人是我。", mood: Mood.HAPPY },
    { text: "昨晚做梦有梦到我吗？我可是梦到你了。", mood: Mood.SHY }
  ],
  afternoon: [
    { text: "下午好，要一起在阳台坐一会儿吗？", mood: Mood.CALM },
    { text: "阳光照得人懒洋洋的，真想就这样靠着你。", mood: Mood.SHY },
    { text: "在想什么？看你发呆很久了。", mood: Mood.HAPPY },
    { text: "饿了吗？我有准备你爱吃的小点心。", mood: Mood.HAPPY }
  ],
  night: [
    { text: "晚安。睡前还要再聊一会儿吗？", mood: Mood.CALM },
    { text: "月色很美，但我的眼里只有你。", mood: Mood.SHY },
    { text: "做个好梦，我会一直在你身边的。", mood: Mood.HAPPY },
    { text: "太晚了，别再看手机了，对眼睛不好。", mood: Mood.TEASING }
  ]
};

export const CHAT_RESOURCES: Dialogue[] = [
  { text: "你知道吗？我最近在设计一座只有我们两人的房子。", mood: Mood.HAPPY },
  { text: "书上的文字很有趣，但不如你有趣。", mood: Mood.TEASING },
  { text: "如果你累了，我的肩膀永远为你留着。", mood: Mood.CALM },
  { text: "刚才...你是不是偷偷看我了？", mood: Mood.SHY },
  { text: "这种宁静的时刻，如果是永恒就好了。", mood: Mood.CALM },
  { text: "偶尔也想对你撒娇呢，可以吗？", mood: Mood.SHY },
  { text: "总觉得认识你之后，连像素风的世界都变得真实了。", mood: Mood.HAPPY },
  { text: "别总是看着屏幕，也看看我呀。", mood: Mood.TEASING },
  { text: "你的手很冷，让我握一会儿吧。", mood: Mood.SHY },
  { text: "今天发生了什么开心的事吗？想听你分享。", mood: Mood.HAPPY },
  { text: "哪怕只是看着你，我也会觉得心情很好。", mood: Mood.CALM },
  { text: "不管发生什么，我都会站在你这一边。", mood: Mood.HAPPY },
  { text: "有时候我也会想，如果没有遇见你，我的生活会是怎样。", mood: Mood.CALM },
  { text: "你脸红的样子，真的很可爱。", mood: Mood.SHY },
  { text: "我们可以就这样什么都不做，只待在一起吗？", mood: Mood.HAPPY }
];

export const TOUCH_REACTIONS: Dialogue[] = [
  { text: "突然摸头...我是小猫吗？（笑）", mood: Mood.TEASING },
  { text: "嗯...你的手心很暖和。", mood: Mood.SHY },
  { text: "还要继续吗？我并不讨厌这种感觉。", mood: Mood.HAPPY },
  { text: "别闹，会把头发弄乱的。", mood: Mood.TEASING },
  { text: "突然这么亲近，我会不知所措的。", mood: Mood.SHY },
  { text: "你的指尖...好像带电。我的心跳快了不少。", mood: Mood.SHY },
  { text: "是在撒娇吗？好吧，我接受了。", mood: Mood.HAPPY }
];

export const FOCUS_DIALOGUE: Dialogue[] = [
  { text: "我会一直陪着你，专心做你的事吧。", mood: Mood.FOCUS },
  { text: "累了就看我一眼，我一直都在。", mood: Mood.FOCUS },
  { text: "专心的你，真的很有魅力。", mood: Mood.FOCUS },
  { text: "加油，完成之后我们一起去散步。", mood: Mood.FOCUS },
  { text: "嘘——我知道你可以做到的。", mood: Mood.FOCUS }
];

export const GIFT_REACTIONS: Dialogue[] = [
  { text: "送给我的？我会好好珍惜的。", mood: Mood.HAPPY },
  { text: "只要是你给的，我都喜欢。", mood: Mood.SHY },
  { text: "这个礼物...很像你的风格，很可爱。", mood: Mood.CALM },
  { text: "谢谢。作为回礼，今晚的时间都交给你？", mood: Mood.TEASING },
  { text: "我会把它放在床头，每天睁眼就能看到。", mood: Mood.HAPPY }
];

export const SPECIAL_EVENTS = [
  { threshold: 10, title: "初次心动", text: "星月递给你一颗像素爱心：“以后，请多关照。”" },
  { threshold: 30, title: "雨中漫步", text: "星月撑开一把伞，将你往怀里搂了搂：“小心淋湿。”" },
  { threshold: 60, title: "星空誓言", text: "在繁星下，他轻吻了你的指尖：“你是我的唯一。”" },
  { threshold: 100, title: "永恒陪伴", text: "他认真地看着你：“无论像素还是现实，我都会找到你。”" }
];
