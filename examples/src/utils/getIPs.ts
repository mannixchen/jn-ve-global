// import

export //get the IP addresses associated with an account
function getIntranetIPs(callback) {
    var ip_dups = {}

    //compatibility for firefox and chrome
    var RTCPeerConnection =
        window.RTCPeerConnection ||
        (window as any).mozRTCPeerConnection ||
        (window as any).webkitRTCPeerConnection
    var useWebKit = !!(window as any).webkitRTCPeerConnection

    //bypass naive webrtc blocking using an iframe
    if (!RTCPeerConnection) {
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var iframe = document.getElementById('iframe') as any
        var win = iframe.contentWindow
        RTCPeerConnection =
            win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection
        useWebKit = !!win.webkitRTCPeerConnection
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{ RtpDataChannels: true }]
    }

    var servers = { iceServers: [{ urls: 'stun:stun.services.mozilla.com' }] }

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints)

    function handleCandidate(candidate) {
        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
        var ip_addr = ip_regex.exec(candidate)[1]

        //remove duplicates
        if (ip_dups[ip_addr] === undefined) callback(ip_addr)

        ip_dups[ip_addr] = true
    }

    //listen for candidate events
    pc.onicecandidate = function (ice) {
        //skip non-candidate events
        if (ice.candidate) handleCandidate(ice.candidate.candidate)
    }

    //create a bogus data channel
    pc.createDataChannel('')

    //create an offer sdp
    pc.createOffer(
        function (result) {
            //trigger the stun server request
            pc.setLocalDescription(
                result,
                function () {},
                function () {}
            )
        },
        function () {}
    )

    //wait for a while to let everything done
    setTimeout(function () {
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n')

        lines.forEach(function (line) {
            if (line.indexOf('a=candidate:') === 0) handleCandidate(line)
        })
    }, 1000)
}

export interface IpsByPconline {
    addr: string
    city: string
    cityCode: string
    err: string
    ip: string
    pro: string
    proCode: string
    region: string
    regionCode: string
    regionNames: string
}
/**
 * 通过太平洋网获取电脑在网络上的IP地址 https://blog.csdn.net/xiaoxiong_jiaxin/article/details/128864075
 * 需要注意是否有次数限制，以及后续是否收费甚至于链接失效
 * 2023-3-21 投入使用
 */
export function getIpsByPconline(cb?: (ips: IpsByPconline) => void) {
    window['ipJson'] = (ips) => {
        window['ips'] = ips
        cb?.(ips)
    }

    try {
        const scriptTag = window.document.createElement('script')
        scriptTag.type = 'text/javascript'
        scriptTag.async = false
        scriptTag.defer = true
        scriptTag.src = 'https://whois.pconline.com.cn/ipJson.jsp?callback=ipJson'
        window.document.head.appendChild(scriptTag)

        // 加载出错
        scriptTag.onerror = (err) => {
            cb?.(null)
        }
    } catch (err) {
        cb?.(null)
        throw new Error('动态获取 ip 失败')
    }
}
