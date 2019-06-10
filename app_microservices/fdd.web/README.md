### Bootstap custom configuration
https://getbootstrap.com/docs/3.3/customize/?id=085a2dff3de01a5c1c6db6e1f6c727f8
https://gist.github.com/085a2dff3de01a5c1c6db6e1f6c727f8

openssl req \                                                   
 -x509 \
 -nodes \
 -days 365 \
 -newkey rsa:2048 \
 -keyout fdd-ssl.key \
 -out fdd-ssl.crt \
 -subj "/CN=fdd-ssl/O=fdd-ssl"

cat fdd-ssl.key | base64  
cat fdd-ssl.crt | base64
