import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

pub contract GhibliNFT: NonFungibleToken {

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let metadata: {String: AnyStruct}

        init(
            id: UInt64,
            metadata: {String: AnyStruct}
        ) {
            self.id = id
            self.metadata = metadata
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Royalties>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.Traits>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.metadata["name"] as! String? ?? "Ghibli NFT",
                        description: self.metadata["description"] as! String? ?? "A magical Ghibli-style NFT",
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.metadata["thumbnail"] as! String? ?? ""
                        )
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(
                        self.id
                    )
                case Type<MetadataViews.Royalties>():
                    return MetadataViews.Royalties([])
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://mintari.app/nft/".concat(self.id.toString()))
                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: GhibliNFT.CollectionStoragePath,
                        publicPath: GhibliNFT.CollectionPublicPath,
                        providerPath: /private/ghibliNFTCollection,
                        publicCollection: Type<&GhibliNFT.Collection{GhibliNFT.GhibliNFTCollectionPublic}>(),
                        publicLinkedType: Type<&GhibliNFT.Collection{GhibliNFT.GhibliNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&GhibliNFT.Collection{GhibliNFT.GhibliNFTCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <-GhibliNFT.createEmptyCollection()
                        })
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://mintari.app/logo.png"
                        ),
                        mediaType: "image/png"
                    )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Ghibli NFT Collection",
                        description: "A collection of magical Ghibli-style NFTs created with AI",
                        externalURL: MetadataViews.ExternalURL("https://mintari.app"),
                        squareImage: media,
                        bannerImage: media,
                        socials: {
                            "twitter": MetadataViews.ExternalURL("https://twitter.com/mintari")
                        }
                    )
                case Type<MetadataViews.Traits>():
                    let traits: [MetadataViews.Trait] = []
                    traits.append(MetadataViews.Trait(
                        name: "Style",
                        value: "Ghibli",
                        displayType: "String",
                        rarity: nil
                    ))
                    traits.append(MetadataViews.Trait(
                        name: "Creator",
                        value: self.metadata["creator"] as! String? ?? "Unknown",
                        displayType: "String",
                        rarity: nil
                    ))
                    return MetadataViews.Traits(traits)
            }
            return nil
        }
    }

    pub resource interface GhibliNFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowGhibliNFT(id: UInt64): &GhibliNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow GhibliNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: GhibliNFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @GhibliNFT.NFT

            let id: UInt64 = token.id

            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowGhibliNFT(id: UInt64): &GhibliNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &GhibliNFT.NFT
            }

            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let ghibliNFT = nft as! &GhibliNFT.NFT
            return ghibliNFT as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub resource NFTMinter {
        pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            metadata: {String: AnyStruct}
        ) {
            let newNFT <- create NFT(
                id: GhibliNFT.totalSupply,
                metadata: metadata
            )

            recipient.deposit(token: <-newNFT)

            GhibliNFT.totalSupply = GhibliNFT.totalSupply + UInt64(1)
        }
    }

    init() {
        self.totalSupply = 0

        self.CollectionStoragePath = /storage/ghibliNFTCollection
        self.CollectionPublicPath = /public/ghibliNFTCollection
        self.MinterStoragePath = /storage/ghibliNFTMinter

        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        self.account.link<&GhibliNFT.Collection{NonFungibleToken.CollectionPublic, GhibliNFT.GhibliNFTCollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}