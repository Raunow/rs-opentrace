export declare const Tags: {
    SPAN_KIND: string;
    SPAN_KIND_RPC_CLIENT: string;
    SPAN_KIND_RPC_SERVER: string;
    /** ------------------------------------------------------------------------
    * ERROR (boolean) indicates whether a Span ended in an error state.
    * --------------------------------------------------------------------------*/
    ERROR: string;
    /** ------------------------------------------------------------------------
    * COMPONENT (string) ia s low-cardinality identifier of the module, library,
    * or package that is generating a span.
    * --------------------------------------------------------------------------*/
    COMPONENT: string;
    /** ------------------------------------------------------------------------
    * SAMPLING_PRIORITY (number) determines the priority of sampling this Span.
    * --------------------------------------------------------------------------*/
    SAMPLING_PRIORITY: string;
    /** ------------------------------------------------------------------------
    * PEER_* tags can be emitted by either client-side of server-side to describe
    * the other side/service in a peer-to-peer communications, like an RPC call.
    * ---------------------------------------------------------------------------*/
    PEER_SERVICE: string;
    PEER_HOSTNAME: string;
    PEER_HOST_IPV4: string;
    PEER_HOST_IPV6: string;
    PEER_PORT: string;
    HTTP_URL: string;
    HTTP_METHOD: string;
    HTTP_STATUS_CODE: string;
    HTTP_PORT: string;
    HTTP_RESPONSE: string;
};
