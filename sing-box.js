const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['👉 Select'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['🇭🇰 HK'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?=.*(香港|hk|hongkong|kong kong|🇭🇰))(?!.*ACA).*$/))
  }
  if (['🇨🇳 TW'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*[ACA]).*(台湾|tw|taiwan|🇹🇼).*/))
  }
  if (['🇯🇵 JP'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*[ACA]).*(日本|jp|japan|🇯🇵).*/))
  }
  if (['🇸🇬 SG'].includes(i.tag)) { 
    i.outbounds.push(...getTags(proxies, /^(?!.*[ACA]).*(新|sg|singapore|🇸🇬).*/))
  }
  if (['🇺🇸 US'].includes(i.tag)) { 
    i.outbounds.push(...getTags(proxies, /^(?!.*[ACA]).*(美国|us|unitedstates|united states|🇺🇸).*/))
  }
  if (['Emby'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /ACA/))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
