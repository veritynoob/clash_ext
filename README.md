# Clash Ext

Clash / Mihomo 覆写脚本与分流规则集合。

## 文件说明

| 文件 | 说明 |
|------|------|
| `mojie.js` | Gemini 分流覆写脚本，筛选美国/新加坡节点 |
| `icu.js` | ICU 分流覆写脚本，筛选包含 `icu` 的节点 |
| `stash.stoverride` | Stash 覆写配置，包含 Gemini 分流、OpenRouter 分流及广告屏蔽 |

## 功能

- **规则提供者**：自动拉取 Gemini 规则集及广告/跟踪域名屏蔽列表
- **策略组**：基于 url-test 的 OpenRouter 策略组，自动选择最优节点
- **分流规则**：REJECT 广告跟踪 → OpenRouter 分流 → Gemini 规则匹配

## 用法

### Mihomo Party / Clash Verge Rev

在覆写/扩展脚本中加载 `mojie.js` 或 `icu.js`。

### Stash

导入 `stash.stoverride` 覆写配置。

## 规则来源

- [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) - Gemini 规则
- [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) - 广告/跟踪域名屏蔽
