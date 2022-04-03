let localState = {
	loading: false,
	inSearch: false,
}
let state = {}

const imageScale = 0.72
const images = {
	weapon: {
		size: 47 * imageScale,
		link: "https://raw.githubusercontent.com/codegamez/metagear-bug-fix/master/images/weapon.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
	gadget: {
		size: 41 * imageScale,
		link: "https://raw.githubusercontent.com/codegamez/metagear-bug-fix/master/images/gadget.png",
		bottom: 0 * imageScale,
		left: 0 * imageScale,
	},
	wheel: {
		size: 68 * imageScale,
		link: "https://raw.githubusercontent.com/codegamez/metagear-bug-fix/master/images/wheel.png",
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
	state = (targetComp && targetComp.state) || state

	if (!state.filters_storage) {
		state.filters_storage = {
			price_orderby: "",
			filter_rangeprice: [],
			filter_rarity: [],
			filter_blueprint: [],
			filter_paymentmethod: [],
			filter_listing_type: [],
			filter_owner: "",
		}
	}

	if (
		state &&
		state.detail &&
		state.detail.item &&
		state.detail.item.gameData
	) {
		detail = state.detail
		isDialog = false
	}

	if (
		state &&
		state.bodyModal &&
		state.bodyModal.props &&
		state.bodyModal.props.detail &&
		state.bodyModal.props.detail.item &&
		state.bodyModal.props.detail.item.gameData
	) {
		detail = state.bodyModal.props.detail
		isDialog = true
	}

	const detailLeftElement = document.querySelector(".single-item__thumbnail")

	if (
		detailLeftElement &&
		detail.item.contract == "0x3e3aef91d5c253387f57ef537b3b0de20afc455e"
	) {
		const bscscanElement = detailLeftElement.querySelector(
			"#single-item__bscscan"
		)
		if (!bscscanElement) {
			const el = document.createElement("a")
			el.id = "single-item__bscscan"
			el.href = `https://bscscan.com/token/0x3e3aef91d5c253387f57ef537b3b0de20afc455e?a=${detail.item.id}`
			el.innerText = "BSC Scan"
			el.classList.add("mb-2", "mt-2")
			el.classList.add("d-inline-block")
			detailLeftElement.appendChild(el)
		}
	}

	const ctrElement = document.querySelector(".single-item__image")

	if (
		detail &&
		ctrElement &&
		!ctrElement.querySelector(".single-item__slots")
	) {
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
						image.size / 3 >
						imageWidth ||
					Math.abs((s.position.y * 400 * imageSize) / imageRealSize) -
						image.size / 3 >
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
	if (
		attributesElement &&
		detail &&
		detail.item &&
		detail.item.metadata &&
		detail.item.metadata.attributes
	) {
		attributes = detail.item.metadata.attributes
	}

	const listingGridElement = document.querySelector(".listing-grid")
	const listSearchElement = document.querySelector("#list-search")
	const listingItemsElement = document.querySelector(
		".listing-grid .row:nth-child(1)"
	)
	const paginationElement = document.querySelector(
		".page-main-content > div:nth-child(3)"
	)

	if (
		state &&
		listSearchElement &&
		listingGridElement &&
		listingItemsElement &&
		paginationElement
	) {
		let listingItemsSecondElement = document.querySelector(
			".listing-grid .row:nth-child(2)"
		)
		let listingLoadingElement = document.querySelector(
			".listing-grid .row:nth-child(3)"
		)
		let searchNameElement = document.querySelector("#cg-search-field-name")
		let searchNameMessageElement = document.querySelector(
			"#cg-search-field-name-message"
		)

		if (!listingItemsSecondElement) {
			const el = document.createElement("div")
			el.classList.add("row")
			el.innerHTML = ``
			listingGridElement.appendChild(el)
			listingItemsSecondElement = document.querySelector(
				".listing-grid .row:nth-child(2)"
			)
			listingItemsSecondElement.classList.add("hidden")
		}

		if (!listingLoadingElement) {
			const el = document.createElement("div")
			el.classList.add("row")
			el.innerHTML = `
				<div class="mh-400 position-relative">
					<div class="pt-4 text-center loading_animate_div" id="animate_div">
						<div class="loading-inner mb-3">
							<div class="progress-wrap">
								<div class="progress-line progress-h-line"></div>
								<div class="progress-line progress-v-line"></div>
								<div class="progress">
									<div
										class="progress-bar"
										role="progressbar"
										id="page-loading-progress-bar"
										aria-valuenow="0"
										aria-valuemin="0"
										aria-valuemax="100"
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			`
			listingGridElement.appendChild(el)
			listingLoadingElement = document.querySelector(
				".listing-grid .row:nth-child(3)"
			)
			listingLoadingElement.classList.add("hidden")
		}

		if (!searchNameElement) {
			const el = document.createElement("div")
			el.classList.add("widget")
			el.innerHTML = `
				<p class="widget-title">Item Name</p>
				<div class="widget-content">
					<input 
						type="text" 
						name="item-name" 
						id="cg-search-field-name" 
						class="search-field mt-0" 
						placeholder="Search by Name">
					<span id="cg-search-field-name-message" class="text-white">select atleast one option from the ITEMS, GEAR, RARITY filters.</span>
				</div>
			`
			document.querySelector(".widget:nth-child(2)").after(el)
			searchNameElement = document.querySelector("#cg-search-field-name")
			searchNameMessageElement = document.querySelector(
				"#cg-search-field-name-message"
			)
			searchNameElement.addEventListener("change", (e) => {
				localState = {
					...localState,
					searchName: e.target.value || "",
				}
				search()
			})
		}

		if (
			!localState.loading &&
			!localState.searchName &&
			localState.inSearch
		) {
			localState = {
				...localState,
				inSearch: false,
			}
		}

		if (localState.inSearch) {
			listingItemsElement.classList.add("hidden")
			paginationElement.classList.add("hidden")
			if (localState.loading) {
				listingLoadingElement.classList.remove("hidden")
				listingItemsSecondElement.classList.add("hidden")
			} else {
				listingLoadingElement.classList.add("hidden")
				listingItemsSecondElement.classList.remove("hidden")
			}
		} else {
			listingLoadingElement.classList.add("hidden")
			listingItemsElement.classList.remove("hidden")
			listingItemsSecondElement.classList.add("hidden")
			paginationElement.classList.remove("hidden")
		}

		if (
			!state.filters_storage.filter_rarity.length &&
			!state.filters_storage.filter_blueprint.length
		) {
			searchNameElement.classList.add("d-none")
			searchNameMessageElement.classList.remove("d-none")
		} else {
			searchNameElement.classList.remove("d-none")
			searchNameMessageElement.classList.add("d-none")
		}
	}
}, 500)

async function search() {
	if (
		!localState.searchName ||
		(localState.searchName &&
			!state.filters_storage.filter_rarity.length &&
			!state.filters_storage.filter_blueprint.length)
	) {
		localState = {
			...localState,
			loading: false,
			inSearch: false,
		}
		return
	}

	localState = {
		...localState,
		loading: true,
		inSearch: true,
	}

	const [orderBy, orderDirection] = state.filters_storage.price_orderby.split(
		"-"
	) || ["", ""]

	try {
		let listings = []
		let maxPage = 1
		for (let page = 1; page <= maxPage; page++) {
			const r = await fetch(
				"https://api.metagear.game/api/v1/public/listings",
				{
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						page: page,
						size: 80,
						orderBy: orderBy || "createdTime",
						orderDirection: orderDirection || "desc",
						filters: [
							state.filters_storage.filter_paymentmethod
								.length && {
								type: "paymentMethod",
								value:
									state.filters_storage
										.filter_paymentmethod || [],
							},
							state.filters_storage.filter_rarity.length && {
								type: "quality",
								value:
									state.filters_storage.filter_rarity || [],
							},
							state.filters_storage.filter_listing_type
								.length && {
								type: "listingType",
								value:
									state.filters_storage.filter_listing_type ||
									[],
							},
							state.filters_storage.filter_blueprint.length && {
								type: "type",
								value:
									state.filters_storage.filter_blueprint ||
									[],
							},
							state.filters_storage.filter_blueprint.length && {
								type: "type",
								value:
									state.filters_storage.filter_blueprint ||
									[],
							},
							{ type: "status", value: ["1"] },
						].filter((v) => v),
					}),
				}
			)
			const data = await r.json()
			maxPage = data.data.totalPage
			listings = [...listings, ...data.data.listings]
		}
		listings = listings.filter((v) =>
			v.item.metadata.name
				.toLowerCase()
				.includes(localState.searchName.toLowerCase())
		)
		updateItemsSencondList(listings)
	} catch (e) {
		console.log(e)
	}

	localState = {
		...localState,
		loading: false,
		inSearch: true,
	}
}

function updateItemsSencondList(items) {
	let listingItemsSecondElement = document.querySelector(
		".listing-grid .row:nth-child(2)"
	)
	if (!listingItemsSecondElement) return

	const quality_badges = {
		Common: "gear-badge-c",
		Rare: "gear-badge-r",
		Mythical: "gear-badge-m",
		Legendary: "gear-badge-l",
	}

	const content = items
		.map((item) => {
			let quality =
				item.item.metadata.attributes.find(
					(v) => v.trait_type == "quality"
				) || null
			if (quality) quality = quality.value || ""
			let is_forever =
				item.item.metadata.attributes.find(
					(v) => v.trait_type == "is_forever"
				) || null
			if (is_forever) is_forever = +is_forever.value
			let quantity = +item.quantity || 1

			let minPrice = item.minPrice
			minPrice =
				minPrice.substring(0, minPrice.length - 18) +
				"." +
				minPrice.substring(minPrice.length - 18)
			minPrice = +minPrice

			let price = item.price
			price =
				price.substring(0, price.length - 18) +
				"." +
				price.substring(price.length - 18)
			price = +price

			let seller = item.seller
			seller = seller.substr(0, 7) + "..." + seller.substr(30, 12)

			const isAction = item.listingType == "auction"

			return `
					<div class="listing-type-buy_now gear-item-wrap col-xl-4 col-md-6">
						<a class="gear-item gear-type-chassis gear-group-gameitem" 
								href="/marketplace/${item.id}">
							<div class="gear-item-content has_quality">
								<div class="gear-item-header">
									<div class="gear-type"></div>
									<h3 class="gear-name box-type-chassis">
										${item.item.metadata.name}
									</h3>
								</div>
								<div class="gear-item-details">
									<div class="quantity quantity_ab ${quantity > 1 ? "" : "d-none"}">
										<strong class="text-white">${quantity}</strong>
									</div>
									<div class="gear-badges ${quality ? "" : "d-none"}">
										<div class="gear-badge ${quality_badges[quality] || ""}">
											<span class="badge-inner">
												${quality}
											</span>
										</div>
									</div>
									<div class="genesis-badge ${is_forever ? "" : "d-none"}"></div>
									<div class="gear-thumbnail">
										<img src="${item.item.metadata.image}" class="">
									</div>
									<div class="gear-author">Owner: ${seller}</div>
									<div class="button-wrap ${isAction ? "d-none" : ""}">
										<div class="button button-red button-hover-green">
											<div class="button-text button-gear">${price} ${item.paymentSymbol}</div>
										</div>
									</div>
									<div class="third-font auction-list-wrap ${isAction ? "" : "d-none"}">
										<div class="d-flex justify-content-center">
											<span class="auction-label">Auction</span>
										</div>
										<div class="d-flex justify-content-between w-100 align-items-center">
											<div class="auction-label-text">START</div>
												<div>
													<strong class="text-blue fs-6 start-price">
														${minPrice} ${item.paymentSymbol}
													</strong>
												</div>
											</div>
											<div class="d-flex justify-content-between w-100 align-items-center">
												<div class="auction-label-text">BUY NOW</div>
											<div>
												<strong class="text-blue fs-5 buy-now-price">
													${price} ${item.paymentSymbol}
												</strong>
											</div>
										</div>
									</div>
								</div>
							</div>
						</a>
					</div>
				`
		})
		.join("\n")

	listingItemsSecondElement.innerHTML = content
}

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

function thousandFormat(value) {
	if (!value) return ""
	let v = (value || "") + ""
	let m = false
	if (v.includes("-")) {
		v = v.replace("-", "")
		m = true
	}
	let afterDot = ""
	if (v.indexOf(".") >= 0) {
		afterDot = v.substring(v.indexOf("."), v.length)
		v = v.substring(0, v.indexOf("."))
	}
	v = v
		.replace(/,/g, "")
		.split("")
		.reverse()
		.join("")
		.replace(/(...)/g, "$1,")
		.split("")
		.reverse()
		.join("")
		.replace(/^,+|,+$/, "")
	if (m) v = "-" + v
	v = v + afterDot
	return v
}
