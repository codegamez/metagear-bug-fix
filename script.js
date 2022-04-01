const findReact = (dom, traverseUp = 0) => {
	const key = Object.keys(dom).find((key) => {
		return (
			key.startsWith("__reactFiber$") || // react 17+
			key.startsWith("__reactInternalInstance$") // react <17
		)
	})
	const domFiber = dom[key]
	if (domFiber == null) return null

	// react <16
	if (domFiber._currentElement) {
		let compFiber = domFiber._currentElement._owner
		for (let i = 0; i < traverseUp; i++) {
			compFiber = compFiber._currentElement._owner
		}
		return compFiber._instance
	}

	// react 16+
	const GetCompFiber = (fiber) => {
		//return fiber._debugOwner; // this also works, but is __DEV__ only
		let parentFiber = fiber.return
		while (typeof parentFiber.type == "string") {
			parentFiber = parentFiber.return
		}
		return parentFiber
	}
	let compFiber = GetCompFiber(domFiber)
	for (let i = 0; i < traverseUp; i++) {
		compFiber = GetCompFiber(compFiber)
	}
	return compFiber.stateNode
}

const imageScale = 0.72
const images = {
	weapon: {
		size: 47 * imageScale,
		link: "https://s23.picofile.com/file/8448746792/weapon.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
	gadget: {
		size: 41 * imageScale,
		link: "https://s23.picofile.com/file/8448746784/gadget.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
	wheel: {
		size: 68 * imageScale,
		link: "https://s22.picofile.com/file/8448746768/wheel.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
}

const intervalId = setInterval(() => {
	let detail
	let isDialog = false

	const targetElement = document.querySelector("#main-content")
	if (!targetElement) return
	const targetComp = findReact(targetElement)

	if (
		targetComp &&
		targetComp.state &&
		targetComp.state.detail &&
		targetComp.state.detail.item &&
		targetComp.state.detail.item.gameData
	) {
		detail = targetComp.state.detail
		isDialog = false
	}

	if (
		targetComp &&
		targetComp.state &&
		targetComp.state.bodyModal &&
		targetComp.state.bodyModal.props &&
		targetComp.state.bodyModal.props.detail &&
		targetComp.state.bodyModal.props.detail.item &&
		targetComp.state.bodyModal.props.detail.item.gameData
	) {
		detail = targetComp.state.bodyModal.props.detail
		isDialog = true
	}

	if (!detail) return

	const ctrElement = document.querySelector(".single-item__image")

	if (ctrElement && !ctrElement.querySelector(".single-item__slots")) {
		const slots = detail.item.gameData.slots || []

		const imageElement = ctrElement.querySelector("img")
		if (!imageElement) return

		const totalWidth = ctrElement.clientWidth
		const totalHeight = ctrElement.clientHeight

		let imageWidth = imageElement.clientWidth
		let imageHeight = imageElement.clientHeight
		let imageSize = Math.max(imageWidth, imageHeight)

		let imageRealWidth = imageElement.naturalWidth
		let imageRealHeight = imageElement.naturalHeight
		let imageRealSize = Math.max(imageRealWidth, imageRealHeight)

		let frameWidth
		let frameHeight

		if (
			slots.filter((s) => {
				const image = images[s.type]
				if (!image) return false
				const t =
					Math.abs((s.position.x * 400 * imageSize) / imageRealSize) -
						image.size >
						imageWidth ||
					Math.abs((s.position.y * 400 * imageSize) / imageRealSize) -
						image.size >
						imageHeight
				return t
			}).length > 1
		) {
			frameWidth = (200 * imageSize) / imageRealSize
			frameHeight = (200 * imageSize) / imageRealSize
		} else {
			frameWidth = (400 * imageSize) / imageRealSize
			frameHeight = (400 * imageSize) / imageRealSize
		}

		ctrElement.innerHTML += `
			<div 
				class="single-item__slots"
				style="width: ${frameWidth}px; height: ${frameHeight}px;"
			/>
		`

		slotsElement = document.querySelector(".single-item__slots")

		slots.forEach((slot) => {
			const image = images[slot.type]
			if (!image) return
			const slotLeft =
				-image.size / 2 +
				image.left +
				frameWidth / 2 +
				(frameWidth * slot.position.x) / 2
			const slotBottom =
				-image.size / 2 +
				image.bottom +
				frameHeight / 2 +
				(frameHeight * slot.position.y) / 2
			slotsElement.innerHTML += `
				<img 
					class="single-item__slot"
					style="
						left: ${slotLeft}px; 
						bottom: ${slotBottom}px;
						width: ${image.size}px;
						height: ${image.size}px;
					"
					src="${image.link}"
					alt=""
				/>
			`
		})
	}

	// attributes
	const attributesElement = document.querySelector(
		".single-item__attributes .row"
	)
	if (!attributesElement) return

	if (
		!detail ||
		!detail.item ||
		!detail.item.metadata ||
		!detail.item.metadata.attributes
	) {
		return
	}

	const attributes = detail.item.metadata.attributes
}, 500)
