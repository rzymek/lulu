dev:build/index.html
	yarn start
build/index.html:
	rsync public/* build/
build:build/index.html
	yarn build
	
.ONESHELL:
deploy: clean build
	cd build
	git init
	git add :/
	git commit -m 'deploy'
	git remote add github git@github.com:rzymek/lulu.git
	git push github HEAD:gh-pages --force

clean:
	rm -rf build/
