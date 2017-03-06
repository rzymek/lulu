.PHONY:  run build
run:
	rsync public/* build/
	yarn start
build:
	rsync public/* build/
	yarn lint && yarn build
	
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
