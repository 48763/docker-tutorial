FROM alpine:3.10

LABEL maintainer="Yuki git@48763 <future.starshine@gmail.com>"

ENV BLOG=yukifans.com
ARG USER=Yuki

RUN set -x \
    && echo "echo -e \"\033[0;41m\${USER}'s blog is \\\"\${BLOG}\\\".\033[0m\"" >> print.sh \
    && /bin/sh print.sh

CMD [ "/bin/sh", "print.sh"]