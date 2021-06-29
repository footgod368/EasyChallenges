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
                    -playerHorizontalSpeed

            else if List.member 68 model.keyPressed || List.member 39 model.keyPressed then
                playerHorizontalSpeed

            else
                0.0

        ( newJump, velocityY ) =
            case model.player.jump of
                Jump jumpNum jumpFrame ->
                    if jumpNum <= 0 then
                        ( model.player.jump, oldVelocityY + gravityAcce )

                    else if List.member 38 model.keyPressed || List.member 87 model.keyPressed then
                        if jumpFrame == -1 then
                            ( Jump jumpNum (playerJumpFrames - 1)
                            , playerInitialJumpSpeed
                                + playerJumpAcce
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
            { oldPlayer | jump = newJump, velocity = ( velocityX, velocityY ) }
    in
    ( { model | player = newPlayer }, cmd )

