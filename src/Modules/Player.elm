module Player exposing
    ( Player
    , init
    , update
    , view
    , playerRefreshJump, playerIfCollidePoly, playerCollideRigidBody
    )

{-| The Player unit, the figure that player controls.


# Player

@docs Player, PlayerJump


# Player Constant

@docs playerWidth, playerHeight, playerJumpNum, playerJumpFrames, playerJumpInitialAcce, playerHorizontalSpeed
@docs playerInitialJumpSpeed, gravityAcce, playerJumpAcce


# init

@docs init


# update

@docs update, updatePlayerVelocity, updatePlayerPos


# view

@docs view


# api to other units

@docs playerRefreshJump, playerIfCollidePoly, playerVerticalCollide, playerHorizontalCollide, playerCollideRigidBody

-}

import Array exposing (Array)
import GlobalBasics
import MainType
import Maybe exposing (withDefault)
import Svg exposing (Svg)
import Svg.Attributes as SvgAttr


{-| `PlayerJump` defines the statuses of the jump. PLayerJump (jumpNum : Int) (jumpFrame : Int). jumpNum : how many
times left can the player jump. jumpFrame : what frame is this jump if it's happening, -1 represents not jumping now
and last jump has keyUp, -2 represents jump has keyDown but last jump hasn't release.
-}
type PlayerJump
    = Jump Int Int


{-| Definition of player, `pos` is current position, `lastPos` store the last position, used in collision test,
`velocity` is its velocity, divided into x-axis and y-axis. `collisionBox` is its `CollisionBox`, `jumpNum` is how
many times it can jump.
-}
type alias Player =
    { pos : GlobalBasics.Pos
    , lastPos : GlobalBasics.Pos
    , velocity : GlobalBasics.Pos
    , jump : PlayerJump
    , ifThisFrameOnGround : Bool
    , collisionBox : GlobalBasics.CollisionBox
    , ifChangeBackToLastPos : Bool
    }


{-| Constant width of player object
-}
playerWidth : Float
playerWidth =
    20.0


{-| Constant height of player object
-}
playerHeight : Float
playerHeight =
    20.0


{-| Constant of how many times player can jump
-}
playerJumpNum : Int
playerJumpNum =
    2

{-| If only one jump and must be the ground
-}
ifOneJumpAndOnTheGround : Bool
ifOneJumpAndOnTheGround =
    True


{-| Constant of how many frames can one jump lasts
-}
playerJumpFrames : Int
playerJumpFrames =
    20


{-| Constant of how many will the player accelerate after the first time the jump is pressed.
-}
playerJumpInitialAcce : Float
playerJumpInitialAcce =
    0.6


{-| Constant of how fast will the player object move when left or right is pressed.
-}
playerHorizontalSpeed : Float
playerHorizontalSpeed =
    2.0


{-| Constant of initial speed of jump.
-}
playerInitialJumpSpeed : Float
playerInitialJumpSpeed =
    -1.0


{-| Constant of the gravity.
-}
gravityAcce : Float
gravityAcce =
    0.1


{-| When the jumps takes place in fameNum, return the corresponding acceleration.
-}
playerJumpAcce : Int -> Float
playerJumpAcce frameNum =
    let
        totalFrame =
            toFloat playerJumpFrames

        nowFrame =
            toFloat frameNum

        acce =
            nowFrame / totalFrame * playerJumpInitialAcce
    in
    acce


{-| Initiate the player with its initial position.
-}
init : GlobalBasics.Pos -> Player
init pos =
    { pos = pos
    , lastPos = pos
    , velocity = ( 0.0, 0.0 )
    , jump = Jump 2 -1
    , ifThisFrameOnGround = False
    , collisionBox =
        GlobalBasics.Polygon
            (Array.fromList
                [ ( ( 0.0, 0.0 ), ( playerWidth, 0.0 ) )
                , ( ( playerWidth, 0.0 ), ( playerWidth, playerHeight ) )
                , ( ( playerWidth, playerHeight ), ( 0.0, playerHeight ) )
                , ( ( 0.0, playerHeight ), ( 0.0, 0.0 ) )
                ]
            )
    , ifChangeBackToLastPos = False
    }


{-| Update of player unit. Calls sub update.
-}
update : ( { model | player : Player, keyPressed : List Int }, Cmd MainType.Msg ) -> ( { model | player : Player, keyPressed : List Int }, Cmd MainType.Msg )
update ( model, cmd ) =
    ( model, cmd )
        |> updatePlayerPos
        |> updatePlayerVelocity


{-| Updates player control, move left, right and jump. Not exposed.
-}
updatePlayerVelocity : ( { model | player : Player, keyPressed : List Int }, Cmd MainType.Msg ) -> ( { model | player : Player, keyPressed : List Int }, Cmd MainType.Msg )
updatePlayerVelocity ( model, cmd ) =
    let
        ( oldVelocityX, oldVelocityY ) =
            model.player.velocity

        velocityX =
            if List.member 37 model.keyPressed || List.member 65 model.keyPressed then
                if List.member 68 model.keyPressed || List.member 39 model.keyPressed then
                    0.0

                else
                    if abs oldVelocityY <= 0.1 then
                        -playerHorizontalSpeed * 2

                    else
                        -playerHorizontalSpeed

            else if List.member 68 model.keyPressed || List.member 39 model.keyPressed then
                    if abs oldVelocityY <= 0.1 then
                        playerHorizontalSpeed * 2

                    else
                        playerHorizontalSpeed

            else
                0.0

        ( newJump, velocityY ) =
            case model.player.jump of
                Jump jumpNum jumpFrame ->
                    if jumpNum <= 0 then
                        ( model.player.jump, oldVelocityY + gravityAcce )

                    else if List.member 38 model.keyPressed || List.member 87 model.keyPressed then
                        if jumpFrame == -1 && ((not ifOneJumpAndOnTheGround) || model.player.ifThisFrameOnGround)then
                            ( Jump jumpNum (playerJumpFrames - 1)
                            , playerInitialJumpSpeed + playerJumpAcce
                                    playerJumpFrames
                            )

                        else if jumpFrame > 0 then
                            ( Jump jumpNum (jumpFrame - 1), oldVelocityY + gravityAcce - playerJumpAcce jumpFrame )

                        else if jumpFrame == 0 then
                            ( Jump (jumpNum - 1) -2, oldVelocityY + gravityAcce )

                        else
                            ( Jump jumpNum jumpFrame, oldVelocityY + gravityAcce )

                    else if jumpFrame == -2 then
                        ( Jump jumpNum -1, oldVelocityY + gravityAcce )

                    else if jumpFrame > 0 then
                        ( Jump (jumpNum - 1) -1, oldVelocityY + gravityAcce )

                    else
                        ( Jump jumpNum jumpFrame, oldVelocityY + gravityAcce )

        oldPlayer =
            model.player

        newPlayer =
                { oldPlayer | jump = newJump, velocity = ( velocityX, velocityY ), ifThisFrameOnGround = False }
    in
    ( { model | player = newPlayer }, cmd )


{-| Updates player pos due to velocity
-}
updatePlayerPos : ( { model | player : Player, keyPressed : List Int }, Cmd MainType.Msg ) -> ( { model | player : Player, keyPressed : List Int }, Cmd MainType.Msg )
updatePlayerPos ( model, cmd ) =
    let
        ( velocityX, velocityY ) =
            model.player.velocity

        ( oldX, oldY ) =
            if model.player.ifChangeBackToLastPos then
                model.player.lastPos

            else
                model.player.pos

        ( newX, newY ) =
            ( oldX + velocityX, oldY + velocityY )

        oldPlayer =
            model.player

        newPlayer =
            { oldPlayer | pos = ( newX, newY ), lastPos = ( oldX, oldY ), ifChangeBackToLastPos = False }
    in
    ( { model | player = newPlayer }, cmd )


{-| View of this player unit
-}
view : { model | player : Player } -> List (Svg MainType.Msg)
view model =
    let
        ( playerX, playerY ) =
            model.player.pos
    in
    [ Svg.rect
        [ SvgAttr.x (String.fromFloat playerX)
        , SvgAttr.y (String.fromFloat playerY)
        , SvgAttr.width (String.fromFloat playerWidth)
        , SvgAttr.height (String.fromFloat playerHeight)
        , SvgAttr.fill "#000000"
        ]
        []
    ]


{-| `playerRefreshJump` turns the number of jumps the player can do into jumpNum constant. You can use it like this.

    egModel =
        { player = init ( 0.0, 0.0 ) }

    newModel =
        playerRefreshJump egModel

-}
playerRefreshJump : { model | player : Player } -> { model | player : Player }
playerRefreshJump model =
    let
        oldPlayer =
            model.player

        newPlayer =
            { oldPlayer | jump = Jump playerJumpNum -1, ifThisFrameOnGround = True }
    in
    { model | player = newPlayer }


{-| `playerIfCollidePoly` judges whether the player collide with a given unit. Input a model, in which always contain
a `Player` and input a unit, in which there should be a `pos` and a `collisionBox`. Return `CollisionStatus`. You
can use it this way:

    egModel =
        { player = init ( 0.0, 0.0 ) }

    egCollisionBox : CollisionBox
    egCollisionBox =
        Polygon (Array.fromList [ ( ( 20.0, 10.0 ), ( 20.0, 50.0 ) ), ( ( 20.0, 50.0 ), ( 60.0, 50.0 ) ) ])

    -- collideStatus == Collided
    collisionStatus : CollisionStatus
    collisionStatus =
        playerIfCollidePoly egModel { pos = ( 5.0, 10.0 ), collisionBox = egCollisionBox }

-}
playerIfCollidePoly : { model | player : Player } -> { unit | pos : GlobalBasics.Pos, collisionBox : GlobalBasics.CollisionBox } -> GlobalBasics.CollisionStatus
playerIfCollidePoly model unit =
    case model.player.collisionBox of
        GlobalBasics.Polygon playerPoly ->
            case unit.collisionBox of
                GlobalBasics.Polygon unitPoly ->
                    let
                        playerPosCollisionBox =
                            GlobalBasics.addPolyPos playerPoly model.player.pos

                        unitCollisionBox =
                            GlobalBasics.addPolyPos unitPoly unit.pos
                    in
                    GlobalBasics.ifCollidePolyPoly playerPosCollisionBox unitCollisionBox


{-| `playerVerticalCollide` handles vertical collision happens on player. Used in `playerCollideRigidBody`. Not exposed.
-}
playerVerticalCollide : { model | player : Player } -> { model | player : Player }
playerVerticalCollide model =
    let
        oldPlayer =
            model.player

        newPlayerChangeVelocity =
            { oldPlayer | velocity = ( Tuple.first oldPlayer.velocity, 0.0 ) }

        --newPlayerChangePos =
        --    { newPlayerChangeVelocity | pos = newPlayerChangeVelocity.lastPos }
        newModel =
            { model | player = newPlayerChangeVelocity }
    in
    newModel


{-| `playerHorizontalCollide` handles horizontal collision happens on player. Used in `playerCollideRigidBody`. Not
exposed.
-}
playerHorizontalCollide : { model | player : Player } -> { model | player : Player }
playerHorizontalCollide model =
    let
        oldPlayer =
            model.player

        newPlayerChangeVelocity =
            { oldPlayer | velocity = ( 0.0, Tuple.second oldPlayer.velocity ) }

        --newPlayerChangePos =
        --    { newPlayerChangeVelocity | pos = newPlayerChangeVelocity.lastPos }
        newModel =
            { model | player = newPlayerChangeVelocity }
    in
    newModel


{-| `playerCollideRigidBody` handles player collide into a unit, which is a rigid body. Since a unit should have
`pos` and `collisionBox` in its definition. You can use it like this way:

    egPlayer : Player
    egPlayer =
        init ( 10.0, 10.0 )

    egModel : { player : Player }
    egModel =
        { player = egPlayer }

    unit : { pos : Pos, collisionBox : CollisionBox }
    unit =
        { pos = ( 5.0, 5.0 )
        , collisionBox =
            Polygon
                (Array.fromList
                    [ ( ( 0, 0 ), ( 10, 0 ) )
                    , ( ( 10, 0 ), ( 10, 10 ) )
                    , ( ( 10, 10 ), ( 0, 10 ) )
                    , ( ( 0, 10 ), ( 0, 0 ) )
                    ]
                )
        }

    resultModel : { player : Player }
    resultModel =
        playerCollideRigidBody egModel player

-}
playerCollideRigidBody : { model | player : Player } -> { unit | pos : GlobalBasics.Pos, collisionBox : GlobalBasics.CollisionBox } -> { model | player : Player }
playerCollideRigidBody model unit =
    case model.player.collisionBox of
        GlobalBasics.Polygon playerPoly ->
            case unit.collisionBox of
                GlobalBasics.Polygon unitPoly ->
                    if playerIfCollidePoly model unit /= GlobalBasics.Collided then
                        model

                    else
                        let
                            playerPolyNow =
                                GlobalBasics.addPolyPos playerPoly model.player.pos

                            unitPolyNow =
                                GlobalBasics.addPolyPos unitPoly unit.pos

                            playerCollideStatusNow =
                                Array.map (\ls -> GlobalBasics.ifCollideLSPoly ls unitPolyNow) playerPolyNow

                            playerCollideSum =
                                Array.foldl
                                    (\collideStatus sum ->
                                        if collideStatus == GlobalBasics.Collided then
                                            sum + 1

                                        else
                                            sum
                                    )
                                    0
                                    playerCollideStatusNow
                        in
                        case playerCollideSum of
                            1 ->
                                if
                                    (withDefault GlobalBasics.NotCollided (Array.get 0 playerCollideStatusNow)
                                        == GlobalBasics.Collided
                                    )
                                        || (withDefault GlobalBasics.NotCollided
                                                (Array.get 2
                                                    playerCollideStatusNow
                                                )
                                                == GlobalBasics.Collided
                                           )
                                then
                                    playerVerticalCollide model

                                else
                                    playerHorizontalCollide model

                            2 ->
                                if
                                    withDefault GlobalBasics.NotCollided (Array.get 0 playerCollideStatusNow)
                                        == GlobalBasics.Collided
                                        && withDefault GlobalBasics.NotCollided (Array.get 2 playerCollideStatusNow)
                                        == GlobalBasics.Collided
                                then
                                    playerHorizontalCollide model

                                else if
                                    withDefault GlobalBasics.NotCollided (Array.get 1 playerCollideStatusNow)
                                        == GlobalBasics.Collided
                                        && withDefault GlobalBasics.NotCollided (Array.get 3 playerCollideStatusNow)
                                        == GlobalBasics.Collided
                                then
                                    playerVerticalCollide model

                                else
                                    let
                                        playerPolyXNow =
                                            GlobalBasics.addPolyPos
                                                playerPoly
                                                ( Tuple.first model.player.pos, Tuple.second model.player.lastPos )

                                        playerPolyYNow =
                                            GlobalBasics.addPolyPos
                                                playerPoly
                                                ( Tuple.first model.player.lastPos, Tuple.second model.player.pos )

                                        collideXModel =
                                            if
                                                GlobalBasics.ifCollidePolyPoly playerPolyXNow unitPolyNow
                                                    == GlobalBasics.Collided
                                            then
                                                playerHorizontalCollide model

                                            else
                                                model

                                        collideYModel =
                                            if
                                                GlobalBasics.ifCollidePolyPoly playerPolyYNow unitPolyNow
                                                    == GlobalBasics.Collided
                                            then
                                                playerVerticalCollide collideXModel

                                            else
                                                collideXModel

                                        --newModel =
                                        --    let
                                        --        oldPlayer =
                                        --            collideYModel.player
                                        --
                                        --        newPlayer =
                                        --                { oldPlayer | pos = oldPlayer.lastPos }
                                        --    in
                                        --    { collideYModel | player = newPlayer }
                                    in
                                    collideYModel

                            3 ->
                                if
                                    withDefault GlobalBasics.NotCollided (Array.get 0 playerCollideStatusNow)
                                        == GlobalBasics.Collided
                                        && withDefault GlobalBasics.NotCollided (Array.get 2 playerCollideStatusNow)
                                        == GlobalBasics.Collided
                                then
                                    playerHorizontalCollide model

                                else
                                    playerVerticalCollide model

                            _ ->
                                model
