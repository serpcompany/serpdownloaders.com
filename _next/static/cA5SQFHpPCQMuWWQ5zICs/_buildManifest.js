self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [],
    "beforeFiles": [
      {
        "source": "/network",
        "destination": "/projects"
      },
      {
        "source": "/network/:path*",
        "destination": "/projects/:path*"
      },
      {
        "source": "/posts",
        "destination": "/guides"
      },
      {
        "source": "/posts/:path*",
        "destination": "/guides/:path*"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()